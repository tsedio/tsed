import type {PlatformStaticsOptions, PlatformStaticsSettings} from "../config/PlatformStaticsSettings.js";
import {getValue} from "@tsed/core";

function mapOptions(options: any): any {
  const opts: PlatformStaticsOptions = typeof options === "string" ? {root: options} : options;
  return {
    ...opts,
    hook: getValue(opts, "hook", "$afterRoutesInit")
  };
}

export function getStaticsOptions(statics?: PlatformStaticsSettings): {
  path: string;
  options: PlatformStaticsOptions;
}[] {
  return Object.entries(statics || {}).reduce(
    (statics, [path, items]) => {
      [].concat(items as any).forEach((options) => {
        statics.push({path, options: mapOptions(options)});
      });

      return statics;
    },
    [] as {path: string; options: PlatformStaticsOptions}[]
  );
}
