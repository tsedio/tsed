import {PlatformBuilder} from "@tsed/common";
import {Type} from "@tsed/core";
import {createServer, proxy} from "aws-serverless-express";

declare global {
  namespace TsED {
    interface Configuration {
      aws: {
        binaryMimeTypes: string[];
      };
    }
  }
}

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)
export const BYNARY_MIME_TYPES = [
  "application/javascript",
  "application/json",
  "application/octet-stream",
  "application/xml",
  "font/eot",
  "font/opentype",
  "font/otf",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "text/comma-separated-values",
  "text/css",
  "text/html",
  "text/javascript",
  "text/plain",
  "text/text",
  "text/xml"
];

export class PlatformAws {
  public static promise: Promise<any>;
  public static platform: PlatformBuilder;
  public static awsServer: any;

  static bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    // istanbul ignore next
    PlatformBuilder.currentPlatform = settings.platform || PlatformBuilder.currentPlatform;

    const platform = PlatformBuilder.currentPlatform.create(module, settings);

    this.promise = platform.bootstrap().then(PlatformAws.onInit);

    return PlatformAws;
  }

  static callback() {
    return async (event: any, context: any) => {
      await PlatformAws.promise;

      return proxy(PlatformAws.awsServer, event, context, "PROMISE").promise;
    };
  }

  protected static async onInit(platform: PlatformBuilder) {
    PlatformAws.platform = platform;

    const binaryMimeTypes = platform.settings.get("aws.binaryMimeTypes", BYNARY_MIME_TYPES);

    await platform.callHook("$beforeListen");

    // create Aws server
    PlatformAws.awsServer = createServer(platform.callback(), PlatformAws.onListen, binaryMimeTypes);
  }

  protected static async onListen() {
    const {platform} = PlatformAws;
    await platform.callHook("$afterListen");
    await platform.injector.emit("$afterListen");
    await platform.ready();
  }
}
