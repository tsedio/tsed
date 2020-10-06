import {PlatformAws} from "@tsed/platform-aws";
import "@tsed/platform-express";
import {Server} from "./Server";

// or import "@tsed/platform-koa";

PlatformAws.bootstrap(Server, {
  aws: {
    binaryMimeTypes: [ // optional
      // mime types list
    ]
  },
  // additional Ts.ED options. See https://tsed.io/tutorials/aws.html
});

// Handler used by AWS
export const handler = PlatformAws.callback();