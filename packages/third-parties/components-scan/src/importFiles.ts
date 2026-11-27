import {pathToFileURL} from "node:url";
import {cleanGlobPatterns} from "./cleanGlobPatterns.js";

export async function importFiles(patterns: string | string[], exclude: string[]): Promise<any[]> {
  const {globby} = await import("globby");

  const globs = cleanGlobPatterns(patterns, exclude);

  // globby >= 15 no longer applies absolute negated patterns, they must be given through the `ignore` option
  const files = await globby(
    globs.filter((glob) => !glob.startsWith("!")),
    {ignore: globs.filter((glob) => glob.startsWith("!")).map((glob) => glob.slice(1))}
  );
  const symbols: any[] = [];

  for (const file of files.sort((a, b) => (a < b ? -1 : 1))) {
    if (!file.endsWith(".d.ts")) {
      // prevent .d.ts import if the global pattern isn't correctly configured
      // import() needs a file URL: on Windows an absolute path such as C:/... is rejected
      const exports = await import(pathToFileURL(file).href);
      Object.keys(exports).forEach((key) => symbols.push(exports[key]));
    }
  }

  return symbols;
}
