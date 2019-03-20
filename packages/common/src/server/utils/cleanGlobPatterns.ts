import * as Path from "path";

export function cleanGlobPatterns(files: string | string[], excludes: string[]): string[] {
  excludes = excludes.map((s: string) => "!" + s.replace(/!/gi, ""));

  return []
    .concat(files as any)
    .map((file: string) => {
      if (!require.extensions[".ts"]) {
        file = file.replace(/\.ts$/i, ".js");
      }

      return Path.resolve(file);
    })
    .concat(excludes as any);
}
