import {isArray, isString} from "@tsed/core";
import {join} from "path";
import fixPath from "normalize-path";

export function normalizePath(item: string, ...paths: string[]): string;
export function normalizePath(item: (string | any)[]): (string | any)[];
export function normalizePath(item: any, ...paths: string[]) {
  if (isString(item)) {
    const path = join(item, ...paths);
    return fixPath(path);
  }

  if (isArray(item)) {
    return item.map((item: any) => normalizePath(item));
  }

  return item;
}
