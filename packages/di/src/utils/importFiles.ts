import globby from "globby";
import {cleanGlobPatterns} from "./cleanGlobPatterns";

export async function importFiles(patterns: string | string[], exclude: string[]): Promise<any[]> {
  const files = await globby(cleanGlobPatterns(patterns, exclude));
  const symbols: any[] = [];

  for (const file of files) {
    if (!file.endsWith(".d.ts")) {
      // prevent .d.ts import if the global pattern isn't correctly configured
      const exports = await import(file);
      Object.keys(exports).forEach((key) => symbols.push(exports[key]));
    }
  }

  return symbols;
}
