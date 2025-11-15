import {constructorOf} from "./constructorOf.js";

/**
 * Returns the textual signature of a class/instance constructor.
 *
 * Example output: `constructor(id: string, name?: string)`.
 * Useful for debugging and documentation generation.
 *
 * @param target Instance or constructor.
 * @returns The constructor signature as a string.
 * @public
 */
export function toStringConstructor(target: any): string {
  const ctr = constructorOf(target);
  const strings = ctr.toString().split("\n");
  const ctrString = strings.find((s) => s.indexOf("constructor(") > -1) || "constructor()";

  return `${ctrString.replace("{", "").trim()}`;
}
