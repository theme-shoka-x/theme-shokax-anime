import Anime from "./Anime";
import type { AnimeOptions } from "./types";
export default class Timeline {
    queue: Anime[];
    constructor();
    add(options?: AnimeOptions): this;
    play(): void;
}
