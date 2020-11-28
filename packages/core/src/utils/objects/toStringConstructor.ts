import {constructorOf} from "./constructorOf";

export function toStringConstructor(target: any): string {
  const ctr = constructorOf(target);
  const strings = ctr.toString().split("\n");
  const ctrString = strings.find((s) => s.indexOf("constructor(") > -1) || "constructor()";

  return `${ctrString.replace("{", "").trim()}`;
}
