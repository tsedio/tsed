import {PlatformStaticsOptions, PlatformStaticsSettings} from "../config/interfaces/PlatformStaticsSettings";

function mapOptions(options: any) {
  const opts: PlatformStaticsOptions =
    typeof options === "string"
      ? {
          root: options,
          hook: "$afterRoutesInit"
        }
      : options;
  return opts;
}

export function getStaticsOptions(statics?: PlatformStaticsSettings): {path: string; options: PlatformStaticsOptions}[] {
  return Object.entries(statics || {}).reduce((statics, [path, items]) => {
    [].concat(items as any).forEach((options) => {
      statics.push({path, options: mapOptions(options)});
    });

    return statics;
  }, [] as {path: string; options: PlatformStaticsOptions}[]);
}
