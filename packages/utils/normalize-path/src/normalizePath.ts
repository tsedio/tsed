import fixPath from "normalize-path";
import {join} from "path";

export function normalizePath(item: string, ...paths: string[]): string;
export function normalizePath(item: (string | any)[]): (string | any)[];
export function normalizePath(item: any, ...paths: string[]) {
  if (typeof item === "string") {
    const path = join(item, ...paths);
    return fixPath(path);
  }

  if (Array.isArray(item)) {
    return item.map((item: any) => normalizePath(item));
  }

  return item;
}
