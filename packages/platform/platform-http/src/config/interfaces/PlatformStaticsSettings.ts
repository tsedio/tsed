declare global {
  namespace TsED {
    // @ts-ignore
    export interface StaticsOptions {
      root: string;
      hook?: "$beforeRoutesInit" | "$afterRoutesInit";
      // @ts-ignore
      [key: string]: any;
    }
  }
}

export interface PlatformStaticsOptions extends TsED.StaticsOptions {
  root: string;

  [key: string]: any;
}

export type PathOrStaticsOptions = string | PlatformStaticsOptions;

export interface PlatformStaticsSettings {
  [endpoint: string]: PathOrStaticsOptions | PathOrStaticsOptions[];
}
