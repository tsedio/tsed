import * as globby from "globby";
import {$log} from "ts-log-debug";
import {cleanGlobPatterns} from "./cleanGlobPatterns";

export async function importFiles(patterns: string | string[], exclude: string[]): Promise<any[]> {
  const files = globby.sync(cleanGlobPatterns(patterns, exclude));
  const symbols: any[] = [];

  for (const file of files) {
    try {
      const exports = await import(file);
      Object.keys(exports).forEach(key => symbols.push(exports[key]));
    } catch (er) {
      /* istanbul ignore next */
      $log.error(er);
      /* istanbul ignore next */
      process.exit(-1);
    }
  }

  return symbols;
}
