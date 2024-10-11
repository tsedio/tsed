import {JsonMapperGlobalOptions} from "@tsed/json-mapper";

export interface PlatformJsonMapperSettings extends JsonMapperGlobalOptions {}

declare global {
  namespace TsED {
    interface Configuration extends Record<string, any> {
      jsonMapper?: PlatformJsonMapperSettings;
    }
  }
}
