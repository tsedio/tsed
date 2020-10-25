import {PlatformAws} from "@tsed/platform-aws";
import "@tsed/platform-express";
import {Server} from "./Server";

PlatformAws.bootstrap(Server, {
  aws: {}
  // additional Ts.ED options. See https://tsed.io/tutorials/aws.html
});

// Handler used by AWS
export const handler = PlatformAws.callback();