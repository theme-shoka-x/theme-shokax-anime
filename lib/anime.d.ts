/* 爱来自ChatGPT和zkz098()
* 使用ChatGPT生成+人工修正 */

type EasingFunction = (t: number) => number;
type EasingFunctions = Record<string, () => EasingFunction>;

type Eases = Record<string, EasingFunction>;

declare const penner: () => Eases & {
    linear: () => EasingFunction;
    easeInSine: () => EasingFunction;
    easeOutSine: () => EasingFunction;
    easeInOutSine: () => EasingFunction;
    easeOutInSine: () => EasingFunction;
    easeInCirc: () => EasingFunction;
    easeOutCirc: () => EasingFunction;
    easeInOutCirc: () => EasingFunction;
    easeOutInCirc: () => EasingFunction;
    easeInBack: () => EasingFunction;
    easeOutBack: () => EasingFunction;
    easeInOutBack: () => EasingFunction;
    easeOutInBack: () => EasingFunction;
    easeInBounce: () => EasingFunction;
    easeOutBounce: () => EasingFunction;
    easeInOutBounce: () => EasingFunction;
    easeOutInBounce: () => EasingFunction;
    easeInQuad: () => EasingFunction;
    easeOutQuad: () => EasingFunction;
    easeInOutQuad: () => EasingFunction;
    easeOutInQuad: () => EasingFunction;
    easeInCubic: () => EasingFunction;
    easeOutCubic: () => EasingFunction;
    easeInOutCubic: () => EasingFunction;
    easeOutInCubic: () => EasingFunction;
    easeInQuart: () => EasingFunction;
    easeOutQuart: () => EasingFunction;
    easeInOutQuart: () => EasingFunction;
    easeOutInQuart: () => EasingFunction;
    easeInQuint: () => EasingFunction;
    easeOutQuint: () => EasingFunction;
    easeInOutQuint: () => EasingFunction;
    easeOutInQuint: () => EasingFunction;
    easeInExpo: () => EasingFunction;
    easeOutExpo: () => EasingFunction;
    easeInOutExpo: () => EasingFunction;
    easeOutInExpo: () => EasingFunction;
};

type ValidTransform = 'translateX' | 'translateY' | 'translateZ';

interface Anime {
    delay: number;
    duration: number;
    targets: HTMLElement | HTMLElement[];
    dest: {
        [key: string]:
            | [number | string, number | string]
            | { value: number | string; duration: number; easing?: string }[];
    };
    easing?: string;
}

type KeyType = 'transform' | 'style' | 'attribute';

interface CloneTarget {
    [key: string]: string | number;
}

interface Engine {
    (anime: Anime): void;
}

declare const engine: Engine;

interface AnimeOptions {
    targets?: any;
    duration?: number;
    easing?: string | EasingFunction;
    delay?: number;
    begin?: (() => void) | null;
    update?: ((anim: Anime) => void) | null;
    complete?: ((anim: Anime) => void) | null;
}

interface AnimeInstance {
    targets: any;
    duration: number;
    easing: string | EasingFunction;
    delay: number;
    begin: (() => void) | null;
    update: ((anim: Anime) => void) | null;
    complete: ((anim: Anime) => void) | null;
    dest: object;
    tl: Timeline | null;
    isPlay: boolean;
    timeline(): Timeline;
    play(): void;
}

declare class Anime {
    constructor(options?: AnimeOptions);
}

interface TimelineInstance {
    queue: AnimeInstance[];
    add(options: AnimeOptions): TimelineInstance;
    play(): void;
}

declare class Timeline {
    constructor();
}

declare const anime: {
    (options?: AnimeOptions): AnimeInstance;
    random(min: number, max: number): number;
};

export default anime;