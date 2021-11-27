import {PlatformBuilder} from "@tsed/common";
import {Type} from "@tsed/core";
import type {Handler} from "aws-lambda";
import serverless from "serverless-http";

export class PlatformServerlessHttp {
  static bootstrap<T extends PlatformBuilder>(module: Type<any>, settings: Partial<TsED.Configuration> = {}): T & {handler(): Handler} {
    // istanbul ignore next
    const adapter = (PlatformBuilder.currentPlatform = settings.platform || PlatformBuilder.currentPlatform);
    const platform = PlatformBuilder.create(adapter, module, settings);
    const promise = platform.bootstrap().then(() => platform.listen());

    (platform as any).handler = (): Handler => {
      let handler: any;

      return async (event, context) => {
        if (!handler) {
          await promise;
          handler = serverless(platform.callback, {
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
