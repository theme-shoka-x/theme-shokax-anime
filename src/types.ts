export interface AnimeOptions {
  targets?: HTMLElement | Record<PropertyKey, any> | HTMLElement[] | Record<PropertyKey, any>[];
  duration?: number;
  easing?: EasingTypes;
  delay?: number;
  begin?: (targets: HTMLElement[] | Record<PropertyKey, any>[]) => void; // 初始回调
  update?: (targets: HTMLElement[] | Record<PropertyKey, any>[]) => void; // 更新回调
  complete?: (targets: HTMLElement[] | Record<PropertyKey, any>[]) => void; // 结束回调
  [index: string]:
    | ((...args: any[]) => string | number)
    | BasicProp
    | FromToProp
    | NestProp
    | KeyFrameProp
    | any;
}

export type KeyFrameProp = NestProp[];
export type NestProp = {
  value: number;
  duration: number;
  easing?: EasingTypes;
  startTimeStamp?: number;
};
export type FromToProp = number[] | string[];
export type BasicProp = number | string;

export type EasingTypes =
  | "linear"
  | "easeInSine"
  | "easeOutSine"
  | "easeInOutSine"
  | "easeOutInSine"
  | "easeInQuad"
  | "easeOutQuad"
  | "easeInOutQuad"
  | "easeOutInQuad"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic"
  | "easeOutInCubic"
  | "easeInQuart"
  | "easeOutQuart"
  | "easeInOutQuart"
  | "easeOutInQuart"
  | "easeInQuint"
  | "easeOutQuint"
  | "easeInOutQuint"
  | "easeOutInQuint"
  | "easeInExpo"
  | "easeOutExpo"
  | "easeInOutExpo"
  | "easeOutInExpo"
  | "easeInCirc"
  | "easeOutCirc"
  | "easeInOutCirc"
  | "easeOutInCirc"
  | "easeInBack"
  | "easeOutBack"
  | "easeInOutBack"
  | "easeOutInBack"
  | "easeInBounce"
  | "easeOutBounce"
  | "easeInOutBounce"
  | "easeOutInBounce";

export type EasingFunction = () => (t: number) => number;
export type EasingFunctions = {
  [index in EasingTypes]: EasingFunction;
};
