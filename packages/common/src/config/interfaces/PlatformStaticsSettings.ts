declare global {
  namespace TsED {
    export interface StaticsOptions {
      root: string;

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
