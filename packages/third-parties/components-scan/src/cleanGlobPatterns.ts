// @ts-ignore
import {normalizePath} from "@tsed/normalize-path";
import {resolve} from "path";

import {isTsEnv} from "./isTsEnv.js";

function mapExcludes(excludes: string[]) {
  return excludes.map((s: string) => `!${s.replace(/!/gi, "")}`);
}

function mapExtensions(file: string): string {
  if (!isTsEnv()) {
    file = file.replace(/\.ts$/i, ".js").replace(/{\.ts,\.js}$/i, ".js");
  }

  return file;
}

export function cleanGlobPatterns(files: string | string[], excludes: string[]): string[] {
  return []
    .concat(files as never)
    .map((s: string) => resolve(s))
    .concat(mapExcludes(excludes) as never)
    .map(mapExtensions)
    .map((s: string) => normalizePath(s));
}
