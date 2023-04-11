// 基础缓动函数
const penner = function () {
  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)
  let eases = { linear: function () { return t => t } };

  const functionEasings = {
    Sine: function () { return t => 1 - Math.cos(t * Math.PI / 2) },
    Circ: function () { return t => 1 - Math.sqrt(1 - t * t) },
    Back: function () { return t => t * t * (3 * t - 2) },
    Bounce: function () {
      return t => {
        let pow2, b = 4;
        while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) { }
        return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2)
      };
    }
  };

  const baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];

  baseEasings.forEach((name, i) => {
    functionEasings[name] = function () { return t => Math.pow(t, i + 2) };
  });

  Object.keys(functionEasings).forEach((name) => {
    let easeIn = functionEasings[name];
    eases['easeIn' + name] = easeIn;
    eases['easeOut' + name] = function () { return t => 1 - easeIn()(1 - t) };
    eases['easeInOut' + name] = function () { return t => t < 0.5 ? easeIn()(t * 2) / 2 : 1 - easeIn()(t * -2 + 2) / 2; };
    eases['easeOutIn' + name] = function () { return t => t < 0.5 ? (1 - easeIn()(1 - t * 2)) / 2 : (easeIn()(t * 2 - 1) + 1) / 2; };
  });
  return eases;
};

/**
 * 
 * Author: D-Sketon
 * Date: 2023-04-10
 */
const engine = function (anime) {
  // 目前仅支持translate
  const validTransform = ['translateX', 'translateY', 'translateZ'];

  function selectKey(target, key) {
    if (target instanceof HTMLElement && target.style && 'transform' in target.style && validTransform.includes(key)) {
      return 'transform';
    } else if (target instanceof HTMLElement && target.style && key in target.style) {
      return 'style';
    } else {
      return 'attribute';
    }
  }

  // 动画开始时间
  const start = Date.now() + anime.delay;
  // 动画结束时间
  const end = start + anime.duration;
  // target是否有效
  const isValid = !!anime.targets;
  let cloneTargets = [];

  // 初始化cloneTargets
  function initTarget() {
    if (!isValid) return;
    // 将targets转换为array便于处理
    if (!(anime.targets instanceof Array)) {
      anime.targets = [anime.targets];
    }
    for (let target of anime.targets) {
      let cloneTarget = {};
      for (let key in anime.dest) {
        if (Array.isArray(anime.dest[key])) {
          // [0,100]类型，from-to模式
          if (anime.dest[key].length === 2 && typeof anime.dest[key][0] !== 'object') {
            // 强制改变当前初始状态
            //需考虑是否为style/transform/attribute
            switch (selectKey(target, key)) {
              case 'transform':
                if (typeof anime.dest[key][0] === 'string') {
                  target.style.transform = `${key}(${anime.dest[key][0]})`;
                } else {
                  target.style.transform = `${key}(${anime.dest[key][0]}px)`;
                }
                break;
              case 'style':
                target['style'][key] = anime.dest[key][0];
                break;
              case 'attribute':
                target[key] = anime.dest[key][0];
                break;
            }
            cloneTarget[key] = anime.dest[key][0];
            anime.dest[key] = anime.dest[key][1];
          } else {
            // keyframe类型
            // 支持 [{value: 1, duration: 500, easing: 'linear'},{value: 2, duration: 500, easing: 'linear'}]
            // value 和 duration 是必须的
            // 为dest绑定startTimeStamp，便于之后判断keyframe
            let start = 0;
            for (let o of anime.dest[key]) {
              o.startTimeStamp = start;
              start += o.duration;
            }
            cloneTarget[key] = target[key];
          }
        } else {
          const keyType = selectKey(target, key);
          switch (keyType) {
            case 'transform':
              let regex = new RegExp(`${key}\((\w+)\)`, 'g');
              // is it true?
              cloneTarget[key] = target.style.transform.match(regex)[0];
              break;
            case 'style':
              cloneTarget[key] = target['style'][key];
              break;
            case 'attribute':
              cloneTarget[key] = target[key];
          }
        }
      }
      cloneTargets.push(cloneTarget);
    }
  }

  // 改变target单个key的属性
  function change(target, origin, elapsed, value, key, final = false) {
    let keyCode;
    if (typeof value === 'string') {
      if (value.endsWith('%')) {
        keyCode = '%';
        value = parseFloat(value);
      } else if (value.endsWith('px')) {
        keyCode = 'px';
        value = parseFloat(value);
      } else {
        throw new TypeError(`string value must ends with '%' or 'px'`);
      }
    }
    let nextValue = final ? value : (value - origin) * elapsed + origin;
    if (keyCode) {
      nextValue += keyCode;
    }
    switch (selectKey(target, key)) {
      case 'transform':
        if (keyCode) {
          target.style.transform = `${key}(${nextValue})`;
        } else {
          target.style.transform = `${key}(${nextValue}px)`;
        }
        break;
      case 'style':
        target['style'][key] = nextValue;
        break;
      case 'attribute':
        target[key] = nextValue;
    }
  }

  // 改变target所有的属性
  function changeAll(elapsed, current, final = false) {
    anime.targets.forEach((target, index) => {
      Object.keys(anime.dest).forEach((key) => {
        let origin = parseFloat(cloneTargets[index][key]);
        let dest = anime.dest[key];
        // 对象类型
        if (typeof dest === 'object') {
          if (Array.isArray(dest)) {
            // keyframe模式
            // 支持 [{value: 1, duration: 500, easing: 'linear'},{value: 2, duration: 500, easing: 'linear'}]
            let i = 0;
            for (; i < dest.length; i++) {
              if (current - start < dest[i].startTimeStamp) {
                break;
              }
            }
            let { value, duration, easing, startTimeStamp } = dest[i - 1];
            if (current <= start + duration + startTimeStamp) {
              elapsed = penner()[easing ? easing : anime.easing]()((current - start) / duration);
              change(target, origin, elapsed, value, key);
            } else if (final) {
              change(target, origin, elapsed, value, key, final);
            }
          } else {
            // nest模式
            // 支持 {value: 1, duration: 500, easing: 'linear'}
            let { value, duration, easing } = dest;
            if (current <= start + duration) {
              elapsed = penner()[easing ? easing : anime.easing]()((current - start) / duration);
              change(target, origin, elapsed, value, key);
            } else if (final) {
              change(target, origin, elapsed, value, key, final);
            }
          }
        } else {
          // function模式
          if (typeof dest === 'function') {
            dest = dest(target, index);
          }
          change(target, origin, elapsed, dest, key, final);
        }
      })
    })
  }

  // 核心函数，用于控制动画rAF
  function step() {
    const current = Date.now();
    // 已经结束，调用结束回调
    if (current > end) {
      // 数据回正
      changeAll(1, current, true);
      anime.complete && typeof anime.complete == 'function' && anime.complete(anime.targets);
      anime.isPlay = false;
      return;
    }
    // 还未开始，继续delay
    if (current < start) {
      requestAnimationFrame(step);
      return;
    }
    const elapsed = penner()[anime.easing]()((current - start) / anime.duration);
    // targets有效
    isValid && changeAll(elapsed, current);
    // 调用更新回调
    anime.update && typeof anime.update == 'function' && anime.update(anime.targets);
    requestAnimationFrame(step);
  }

  initTarget();
  // 调用初始回调
  anime.begin && typeof anime.begin == 'function' && anime.begin(anime.targets);
  step();
}

// 默认配置
const defaultOptions = {
  targets: null,
  duration: Infinity,
  easing: 'linear',
  delay: 0,
  begin: null,  // 初始回调
  update: null, // 更新回调
  complete: null  // 结束回调
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

class Timeline {
  constructor() {
    this.queue = [];
  }

  add(options) {
    this.queue.push(new Anime(options));
    return this;
  }

  play() {
    this.queue.forEach(instance => instance.play());
  }
}

const anime = function (options) {
  return new Anime(options);
};

anime.random = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default anime;