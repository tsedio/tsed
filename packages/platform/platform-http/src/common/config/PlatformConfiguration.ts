import {DIConfiguration} from "@tsed/di";
import {JsonMapperGlobalOptions} from "@tsed/json-mapper";
import type {PlatformStaticsSettings} from "./PlatformStaticsSettings.js";
import {Type} from "@tsed/core";

export interface PlatformRouterSettings {
  appendChildrenRoutesFirst?: boolean;
}

declare global {
  namespace TsED {
    interface Configuration {
      rootModule?: Type;
      rootDir?: string;
      httpPort?: string | number | false;
      httpsPort?: string | number | false;
      jsonMapper?: JsonMapperGlobalOptions;
      router?: PlatformRouterSettings;
      statics?: PlatformStaticsSettings;
    }

    // @ts-ignore
    interface StaticsOptions {
      root: string;
      hook?: "$beforeRoutesInit" | "$afterRoutesInit";

      // @ts-ignore
      [key: string]: any;
    }

    interface MultipartFileOptions {}

    interface MultipartFileInstance {}
  }
}

/**
 * @deprecated
 */
export const PlatformConfiguration = DIConfiguration;
export type PlatformConfiguration = DIConfiguration & TsED.Configuration;
