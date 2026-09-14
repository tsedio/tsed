import {isTsEnv} from "./isTsEnv.js";
import {normalizePath} from "@tsed/normalize-path";
import {resolve} from "node:path";

function mapExcludes(excludes: string[]) {
  // Normalize before adding "!": on Windows, normalizing "!C:\..." prefixes it with "./",
  // so the pattern would no longer be negated.
  return excludes.map((s: string) => `!${normalizePath(mapExtensions(s.replace(/!/gi, "")))}`);
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
    .map((s: string) => normalizePath(mapExtensions(resolve(s))))
    .concat(mapExcludes(excludes));
}
