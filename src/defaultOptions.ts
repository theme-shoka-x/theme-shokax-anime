import type { AnimeOptions } from "./types";

export const defaultOptions: AnimeOptions = {
  targets: null,
  duration: Infinity,
  easing: "linear",
  delay: 0,
  begin: null, // 初始回调
  update: null, // 更新回调
  complete: null, // 结束回调
};
