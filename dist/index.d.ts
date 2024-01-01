import Anime from "./Anime";
import type { AnimeOptions } from "./types";
declare const anime: {
    (options?: AnimeOptions): Anime;
    random(min: number, max: number): number;
};
export default anime;
