import type {OpenApiSettings} from "@tsed/openapi-utils";
// @ts-ignore
import type {ReferenceConfiguration} from "@scalar/types";

export type ScalarSettings = OpenApiSettings &
  ReferenceConfiguration & {
    cdn?: string;
    options?: ReferenceConfiguration;
  };

declare global {
  namespace TsED {
    interface Configuration {
      scalar?: ScalarSettings[];
    }
  }
}
