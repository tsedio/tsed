import {pathToFileURL} from "node:url";
import {cleanGlobPatterns} from "./cleanGlobPatterns.js";

export async function importFiles(patterns: string | string[], exclude: string[]): Promise<any[]> {
  const {globby} = await import("globby");

  const files = await globby(cleanGlobPatterns(patterns, exclude));
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
