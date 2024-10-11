import {Type} from "@tsed/core";
import {PlatformBuilder, PlatformBuilderSettings} from "@tsed/platform-http";
import type {Handler} from "aws-lambda";
import serverless from "serverless-http";

export class PlatformServerlessHttp {
  static bootstrap(module: Type<any>, settings: PlatformBuilderSettings<any>): PlatformBuilder & {handler(): Handler} {
    const platform = PlatformBuilder.create(module, settings);
    const promise = platform.listen();

    (platform as any).handler = (): Handler => {
      let handler: any;

      return async (event, context) => {
        // istanbul ignore else
        if (!handler) {
          await promise;
          handler = serverless(platform.callback(), {
            request(request: any) {
              request.serverless = {event, context};
            }
          });
        }

        return handler(event, context);
      };
    };

    return platform as any;
  }
}
