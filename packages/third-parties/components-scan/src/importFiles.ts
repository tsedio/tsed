import {importPackage} from "@tsed/core";

import {cleanGlobPatterns} from "./cleanGlobPatterns.js";

export async function importFiles(patterns: string | string[], exclude: string[]): Promise<any[]> {
  const {globby} = await import("globby");

  const files = await globby(cleanGlobPatterns(patterns, exclude));
  const symbols: any[] = [];

  for (const file of files.sort((a, b) => (a < b ? -1 : 1))) {
    if (!file.endsWith(".d.ts")) {
      // prevent .d.ts import if the global pattern isn't correctly configured
      const exports = await importPackage(file);
      Object.keys(exports).forEach((key) => symbols.push(exports[key]));
    }
  }

  return symbols;
}
