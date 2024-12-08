// @ts-ignore
import type {ReferenceConfiguration} from "@scalar/types/legacy";
import type {OpenApiSettings} from "@tsed/openapi-utils";

export type ScalarSettings = OpenApiSettings &
  ReferenceConfiguration & {
    cdn?: string;
    options?: ReferenceConfiguration;
  };
