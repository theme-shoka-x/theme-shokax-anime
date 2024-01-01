'use strict';

class Timeline {
    constructor() {
        this.queue = [];
    }
    add(options) {
        this.queue.push(new Anime(options));
        return this;
    }
    play() {
        this.queue.forEach((instance) => instance.play());
    }
}

const defaultOptions = {
    targets: null,
    duration: Infinity,
    easing: "linear",
    delay: 0,
    begin: null, // 初始回调
    update: null, // 更新回调
    complete: null, // 结束回调
};

var penner = () => {
    // Based on jQuery UI's implementation of easing equations from Robert Penner (http://www.robertpenner.com/easing)
    const eases = {
        linear: () => (t) => t,
    };
    const functionEasings = {
        Sine: () => (t) => 1 - Math.cos((t * Math.PI) / 2),
        Circ: () => (t) => 1 - Math.sqrt(1 - t * t),
        Back: () => (t) => t * t * (3 * t - 2),
        Bounce: () => (t) => {
            let pow2, b = 4;
            while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) { }
            return (1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2));
        },
    };
    const baseEasings = ["Quad", "Cubic", "Quart", "Quint", "Expo"];
    baseEasings.forEach((name, i) => {
        functionEasings[name] = () => (t) => Math.pow(t, i + 2);
    });
    Object.keys(functionEasings).forEach((name) => {
        const easeIn = functionEasings[name];
        eases["easeIn" + name] = easeIn;
        eases["easeOut" + name] = () => (t) => 1 - easeIn()(1 - t);
        eases["easeInOut" + name] = () => (t) => t < 0.5 ? easeIn()(t * 2) / 2 : 1 - easeIn()(t * -2 + 2) / 2;
        eases["easeOutIn" + name] = () => (t) => t < 0.5 ? (1 - easeIn()(1 - t * 2)) / 2 : (easeIn()(t * 2 - 1) + 1) / 2;
    });
    return eases;
};

// 目前仅支持translate
const validTransform = ["translateX", "translateY", "translateZ"];
const selectKey = (target, key) => {
    if (target instanceof HTMLElement &&
        target.style &&
        "transform" in target.style &&
        validTransform.includes(key)) {
        return "transform";
    }
    if (target instanceof HTMLElement && target.style && key in target.style) {
        return "style";
    }
    return "attribute";
};
var engine = (anime) => {
    // 动画开始时间
    const start = Date.now() + anime.delay;
    // 动画结束时间
    const end = start + anime.duration;
    // target是否有效
    const isValid = !!anime.targets;
    const cloneTargets = [];
    // 初始化cloneTargets
    const initTarget = () => {
        if (!isValid)
            return;
        // 将targets转换为array
        if (!Array.isArray(anime.targets)) {
            anime.targets = [anime.targets];
        }
        for (const target of anime.targets) {
            const cloneTarget = {};
            for (const propKey in anime.dest) {
                const propValue = anime.dest[propKey];
                if (Array.isArray(propValue)) {
                    // [0,100]类型，from-to模式
                    if (propValue.length === 2 && typeof propValue[0] !== "object") {
                        // 强制改变当前初始状态
                        // 需考虑是否为style/transform/attribute
                        switch (selectKey(target, propKey)) {
                            case "transform":
                                if (typeof propValue[0] === "string") {
                                    target.style.transform = `${propKey}(${propValue[0]})`;
                                }
                                else {
                                    target.style.transform = `${propKey}(${propValue[0]}px)`;
                                }
                                break;
                            case "style":
                                target["style"][propKey] = propValue[0];
                                break;
                            case "attribute":
                                target[propKey] = propValue[0];
                                break;
                        }
                        cloneTarget[propKey] = propValue[0];
                        anime.dest[propKey] = propValue[1];
                    }
                    else {
                        // keyframe类型
                        // 支持 [{value: 1, duration: 500, easing: 'linear'},{value: 2, duration: 500, easing: 'linear'}]
                        // value 和 duration 是必须的
                        // 为dest绑定startTimeStamp，便于之后判断keyframe
                        let start = 0;
                        for (let o of propValue) {
                            o.startTimeStamp = start;
                            start += o.duration;
                        }
                        cloneTarget[propKey] = target[propKey];
                    }
                }
                else {
                    const keyType = selectKey(target, propKey);
                    switch (keyType) {
                        case "transform":
                            const regex = new RegExp(`${propKey}\((\w+)\)`, "g");
                            // is it true?
                            cloneTarget[propKey] = target.style.transform.match(regex)[0];
                            break;
                        case "style":
                            cloneTarget[propKey] = target["style"][propKey];
                            break;
                        case "attribute":
                            cloneTarget[propKey] = target[propKey];
                    }
                }
            }
            cloneTargets.push(cloneTarget);
        }
    };
    // 改变target单个key的属性
    const change = (target, origin, elapsed, value, key, final = false) => {
        let keyCode;
        if (typeof value === "string") {
            if (value.endsWith("%")) {
                keyCode = "%";
                value = parseFloat(value);
            }
            else if (value.endsWith("px")) {
                keyCode = "px";
                value = parseFloat(value);
            }
            else {
                throw new TypeError(`string value must ends with '%' or 'px'`);
            }
        }
        let nextValue = final ? value : (value - origin) * elapsed + origin;
        if (keyCode) {
            nextValue += keyCode;
        }
        switch (selectKey(target, key)) {
            case "transform":
                if (keyCode) {
                    target.style.transform = `${key}(${nextValue})`;
                }
                else {
                    target.style.transform = `${key}(${nextValue}px)`;
                }
                break;
            case "style":
                target["style"][key] = nextValue;
                break;
            case "attribute":
                target[key] = nextValue;
        }
    };
    // 改变target所有的属性
    const changeAll = (elapsed, current, final = false) => {
        anime.targets.forEach((target, index) => {
            Object.keys(anime.dest).forEach((key) => {
                const origin = parseFloat(cloneTargets[index][key]);
                let dest = anime.dest[key];
                // 对象类型
                if (typeof dest === "object") {
                    if (Array.isArray(dest)) {
                        // keyframe模式
                        // 支持 [{value: 1, duration: 500, easing: 'linear'},{value: 2, duration: 500, easing: 'linear'}]
                        let i = 0;
                        for (; i < dest.length; i++) {
                            if (current - start <
                                dest[i].startTimeStamp) {
                                break;
                            }
                        }
                        const { value, duration, easing, startTimeStamp } = dest[i - 1];
                        if (current <= start + duration + startTimeStamp) {
                            elapsed = penner()[easing ? easing : anime.easing]()((current - start) / duration);
                            change(target, origin, elapsed, value, key);
                        }
                        else if (final) {
                            change(target, origin, elapsed, value, key, final);
                        }
                    }
                    else {
                        // nest模式
                        // 支持 {value: 1, duration: 500, easing: 'linear'}
                        const { value, duration, easing } = dest;
                        if (current <= start + duration) {
                            elapsed = penner()[easing ? easing : anime.easing]()((current - start) / duration);
                            change(target, origin, elapsed, value, key);
                        }
                        else if (final) {
                            change(target, origin, elapsed, value, key, final);
                        }
                    }
                }
                else {
                    // function模式
                    if (typeof dest === "function") {
                        dest = dest(target, index);
                    }
                    change(target, origin, elapsed, dest, key, final);
                }
            });
        });
    };
    // 核心函数，用于控制动画rAF
    const step = () => {
        const current = Date.now();
        // 已经结束，调用结束回调
        if (current > end) {
            // 数据回正
            changeAll(1, current, true);
            typeof anime.complete == "function" &&
                anime.complete(anime.targets);
            anime.isPlay = false;
            return;
        }
        // 还未开始，继续delay
        if (current < start) {
            requestAnimationFrame(step);
            return;
        }
        const elapsed = penner()[anime.easing]()((current - start) / anime.duration);
        isValid && changeAll(elapsed, current);
        // 调用更新回调
        typeof anime.update == "function" &&
            anime.update(anime.targets);
        requestAnimationFrame(step);
    };
    initTarget();
    // 调用初始回调
    typeof anime.begin == "function" &&
        anime.begin(anime.targets);
    step();
};

class Anime {
    constructor(options = defaultOptions) {
        options = Object.assign({}, defaultOptions, options);
        const { targets, duration, easing, delay, begin, update, complete, ...dest } = options;
        this.targets = targets;
        this.duration = duration;
        this.easing = easing;
        this.delay = delay;
        this.begin = begin;
        this.update = update;
        this.complete = complete;
        this.dest = dest ? dest : {};
        this.tl = null;
        this.isPlay = false;
    }
    timeline() {
        if (this.tl === null) {
            this.tl = new Timeline();
        }
        return this.tl;
    }
    play() {
        if (!this.isPlay) {
            this.isPlay = true;
            engine(this);
        }
    }
}

const anime = (options) => {
    return new Anime(options);
};
anime.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = anime;
