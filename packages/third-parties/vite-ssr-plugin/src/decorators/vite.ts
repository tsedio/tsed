import {View} from "@tsed/schema";

export function Vite(path?: string) {
  return View(`${path || "*"}.vite`);
}
