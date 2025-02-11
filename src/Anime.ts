import Timeline from "./Timeline";
import { defaultOptions } from "./defaultOptions";
import engine from "./lib/engine";
import type {
  EasingTypes,
  BasicProp,
  FromToProp,
  NestProp,
  KeyFrameProp,
  AnimeOptions,
} from "./types";

export default class Anime {
  targets: HTMLElement | Record<PropertyKey, any> | HTMLElement[] | Record<PropertyKey, any>[];
  duration: number;
  easing: EasingTypes;
  delay: number;
  begin?: (targets: HTMLElement[] | Record<PropertyKey, any>[]) => void;
  update?: (targets: HTMLElement[] | Record<PropertyKey, any>[]) => void;
  complete?: (targets: HTMLElement[] | Record<PropertyKey, any>[]) => void;
  dest: Record<
    string,
    | ((...args: any[]) => string | number)
    | BasicProp
    | FromToProp
    | NestProp
    | KeyFrameProp
  >;
  tl: Timeline;
  isPlay: boolean;
  constructor(options: AnimeOptions = defaultOptions) {
    options = { ...defaultOptions, ...options };
    const {
      targets,
      duration,
      easing,
      delay,
      begin,
      update,
      complete,
      ...dest
    } = options;
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
    if (!this.tl) {
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
