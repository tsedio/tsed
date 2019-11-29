import {resolve} from "path";

const normalizePath = require("normalize-path");

function mapExcludes(excludes: string[]) {
  return excludes.map((s: string) => `!${s.replace(/!/gi, "")}`);
}

function mapExtensions(file: string): string {
  if (!require.extensions[".ts"] && !process.env["TS_TEST"]) {
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
