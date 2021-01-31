import {normalizePath} from "@tsed/core";
import {resolve} from "path";

function isTsEnv() {
  return (
    (require && require.extensions && require.extensions[".ts"]) ||
    process.env["TS_TEST"] ||
    process.env.JEST_WORKER_ID !== undefined ||
    process.env.NODE_ENV === "test"
  );
}

function mapExcludes(excludes: string[]) {
  return excludes.map((s: string) => `!${s.replace(/!/gi, "")}`);
}

function mapExtensions(file: string): string {
  if (!isTsEnv()) {
    file = file.replace(/\.ts$/i, ".js");
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
