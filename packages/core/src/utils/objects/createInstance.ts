import {classOf} from "./classOf";

export function createInstance(obj: any) {
  return obj ? (classOf(obj) !== Object ? Object.create(obj) : {}) : {};
}
