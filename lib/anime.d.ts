type EasingTypes =
    | 'linear'
    | 'easeInSine'
    | 'easeOutSine'
    | 'easeInOutSine'
    | 'easeOutInSine'
    | 'easeInQuad'
    | 'easeOutQuad'
    | 'easeInOutQuad'
    | 'easeOutInQuad'
    | 'easeInCubic'
    | 'easeOutCubic'
    | 'easeInOutCubic'
    | 'easeOutInCubic'
    | 'easeInQuart'
    | 'easeOutQuart'
    | 'easeInOutQuart'
    | 'easeOutInQuart'
    | 'easeInQuint'
    | 'easeOutQuint'
    | 'easeInOutQuint'
    | 'easeOutInQuint'
    | 'easeInExpo'
    | 'easeOutExpo'
    | 'easeInOutExpo'
    | 'easeOutInExpo'
    | 'easeInCirc'
    | 'easeOutCirc'
    | 'easeInOutCirc'
    | 'easeOutInCirc'
    | 'easeInBack'
    | 'easeOutBack'
    | 'easeInOutBack'
    | 'easeOutInBack'
    | 'easeInBounce'
    | 'easeOutBounce'
    | 'easeInOutBounce'
    | 'easeOutInBounce';

type EasingFunction = (t:number)=>number
type EasingFunctions = {
    [index in EasingTypes]:EasingFunction;
};

interface AnimeOptions {
    targets?: any,
    duration?: number,
    easing?: string,
    delay?: number,
    begin?: Function,  // 初始回调
    update?: Function, // 更新回调
    complete?: Function,  // 结束回调
    [index:string]:any
}

declare function penner(): EasingFunctions
declare function engine(anime:Anime):void
declare class Timeline {
    constructor()
    add(option?:AnimeOptions):Timeline
    play():void
}
declare class Anime {
    tl: Timeline
    // dest的类型有点多，先写成any
    dest: any

    constructor(options?:AnimeOptions)
    timeline():Timeline
    play():void
}

declare function anime(options?:AnimeOptions):Anime

declare namespace anime {
    function random(min: number, max: number): number;
}

export = anime
export as namespace anime