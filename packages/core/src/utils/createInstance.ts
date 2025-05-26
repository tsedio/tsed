import {classOf} from "./classOf.js";

export function createInstance(obj: any) {
  return obj ? (classOf(obj) !== Object ? Object.create(obj) : {}) : {};
}
