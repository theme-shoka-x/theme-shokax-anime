import type Anime from "../Anime";
import type { KeyFrameProp } from "../types";
import penner from "./penner";

const pennerFn = penner();

// 目前仅支持translate
const validTransform = ["translateX", "translateY", "translateZ"];

const selectKey = (target: HTMLElement | object, key: string) =>
  target instanceof HTMLElement
    ? "transform" in target.style && validTransform.includes(key)
      ? "transform"
      : key in target.style
      ? "style"
      : "attribute"
    : "attribute";

export default (anime: Anime) => {
  // 动画开始时间
  const start = Date.now() + anime.delay;
  // 动画结束时间
  const end = start + anime.duration;
  // target是否有效
  const isValid = !!anime.targets;
  const cloneTargets: Record<string, number | string>[] = [];

  // 初始化cloneTargets
  const initTarget = () => {
    if (!isValid) return;
    // 将targets转换为array
    if (!Array.isArray(anime.targets)) {
      anime.targets = [anime.targets];
    }
    for (const target of anime.targets as HTMLElement[] | object[]) {
      const cloneTarget: Record<string, number | string> = {};
      for (const propKey in anime.dest) {
        const propValue = anime.dest[propKey];
        const keyType = selectKey(target, propKey);
        if (Array.isArray(propValue)) {
          // [0,100]类型，from-to模式
          if (propValue.length === 2 && typeof propValue[0] !== "object") {
            // 强制改变当前初始状态
            if (keyType === "transform") {
              (target as HTMLElement).style.transform = `${propKey}(${
                typeof propValue[0] === "string"
                  ? propValue[0]
                  : propValue[0] + "px"
              })`;
            } else if (keyType === "style") {
              (target as HTMLElement).style[propKey] = propValue[0];
            } else {
              target[propKey] = propValue[0];
            }
            cloneTarget[propKey] = propValue[0];
            anime.dest[propKey] = propValue[1];
          } else {
            // keyframe类型
            // 支持 [{value: 1, duration: 500, easing: 'linear'},{value: 2, duration: 500, easing: 'linear'}]
            // value 和 duration 是必须的
            // 为dest绑定startTimeStamp，便于之后判断keyframe
            let start = 0;
            for (let o of propValue as KeyFrameProp) {
              o.startTimeStamp = start;
              start += o.duration;
            }
            cloneTarget[propKey] = target[propKey];
          }
        } else {
          if (keyType === "transform") {
            cloneTarget[propKey] = (
              target as HTMLElement
            ).style.transform.match(new RegExp(`${propKey}\\((\\w+)\\)`))[1];
          } else if (keyType === "style") {
            cloneTarget[propKey] = (target as HTMLElement).style[propKey];
          } else {
            cloneTarget[propKey] = target[propKey];
          }
        }
      }
      cloneTargets.push(cloneTarget);
    }
  };

  // 改变target单个key的属性
  const change = (
    target: object | HTMLElement,
    origin: number,
    elapsed: number,
    value: string | number,
    key: string,
    final = false
  ) => {
    let keyCode;
    if (typeof value === "string") {
      keyCode = value.endsWith("%") ? "%" : value.endsWith("px") ? "px" : null;
      if (keyCode) {
        value = parseFloat(value);
      } else {
        throw new TypeError(`string value must ends with '%' or 'px'`);
      }
    }
    let nextValue = final ? value : (value - origin) * elapsed + origin;
    if (keyCode) {
      nextValue += keyCode;
    }
    const targetKey = selectKey(target, key);
    if (targetKey === "transform")
      (target as HTMLElement).style.transform = `${key}(${nextValue}${
        keyCode ? "" : "px"
      })`;
    else if (targetKey === "style")
      (target as HTMLElement).style[key] = nextValue;
    else target[key] = nextValue;
  };

  // 改变target所有的属性
  const changeAll = (elapsed: number, current: number, final = false) => {
    (anime.targets as HTMLElement[] | object[]).forEach(
      (target: HTMLElement | object, index: string | number) => {
        Object.keys(anime.dest).forEach((key) => {
          let origin = parseFloat(cloneTargets[index][key]);
          let dest = anime.dest[key];
          // 对象类型
          if (typeof dest === "object") {
            if (Array.isArray(dest)) {
              // keyframe模式
              // 支持 [{value: 1, duration: 500, easing: 'linear'},{value: 2, duration: 500, easing: 'linear'}]
              let i = 0;
              while (
                i < dest.length &&
                current - start >= (dest as KeyFrameProp)[i].startTimeStamp
              )
                i++;
              const {
                value,
                duration,
                easing = anime.easing,
                startTimeStamp,
              } = (dest as KeyFrameProp)[i - 1];
              origin = i <= 1 ? origin : (dest as KeyFrameProp)[i - 2].value;
              const elapsed = pennerFn[easing]()(
                (current - start - startTimeStamp) / duration
              );
              if (current <= start + duration + startTimeStamp) {
                change(target, origin, elapsed, value, key);
              } else if (final) {
                change(target, origin, elapsed, value, key, final);
              }
            } else {
              // nest模式
              // 支持 {value: 1, duration: 500, easing: 'linear'}
              const { value, duration, easing = anime.easing } = dest;
              const elapsed = pennerFn[easing]()((current - start) / duration);
              if (current <= start + duration) {
                change(target, origin, elapsed, value, key);
              } else if (final) {
                change(target, origin, elapsed, value, key, final);
              }
            }
          } else {
            // function模式
            if (typeof dest === "function") {
              dest = dest(target, index);
            }
            change(
              target,
              origin,
              elapsed,
              dest as number | string,
              key,
              final
            );
          }
        });
      }
    );
  };

  // 核心函数，用于控制动画rAF
  const step = () => {
    const current = Date.now();
    if (current > end) {
      // 数据回正
      changeAll(1, current, true);
      if (typeof anime.complete === "function") {
        // 已经结束，调用结束回调
        anime.complete(anime.targets as HTMLElement[] | object[]);
      }
      anime.isPlay = false;
    } else {
      if (current >= start) {
        const elapsed = pennerFn[anime.easing]()(
          (current - start) / anime.duration
        );
        if (isValid) changeAll(elapsed, current);
        if (typeof anime.update === "function") {
          // 调用更新回调
          anime.update(anime.targets as HTMLElement[] | object[]);
        }
      }
      requestAnimationFrame(step);
    }
  };

  initTarget();
  // 调用初始回调
  if (typeof anime.begin === "function") {
    anime.begin(anime.targets as HTMLElement[] | object[]);
  }
  step();
};
