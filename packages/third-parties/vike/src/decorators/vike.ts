import {View} from "@tsed/schema";

export function Vike(path?: string) {
  return View(`${path || "*"}.vike`);
}
