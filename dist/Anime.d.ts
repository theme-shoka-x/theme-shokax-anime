import Timeline from "./Timeline";
import type { EasingTypes, BasicProp, FromToProp, NestProp, KeyFrameProp, AnimeOptions } from "./types";
export default class Anime {
    targets: HTMLElement | object | HTMLElement[] | object[];
    duration: number;
    easing: EasingTypes;
    delay: number;
    begin?: (targets: HTMLElement[] | object[]) => void;
    update?: (targets: HTMLElement[] | object[]) => void;
    complete?: (targets: HTMLElement[] | object[]) => void;
    dest: Record<string, ((...args: any[]) => string | number) | BasicProp | FromToProp | NestProp | KeyFrameProp>;
    tl: Timeline;
    isPlay: boolean;
    constructor(options?: AnimeOptions);
    timeline(): Timeline;
    play(): void;
}
