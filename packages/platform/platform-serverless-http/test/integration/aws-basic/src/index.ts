import {PlatformExpress} from "@tsed/platform-express";

import {PlatformServerlessHttp} from "../../../../src/index.js";
import {Server} from "./Server.js";

const platform = PlatformServerlessHttp.bootstrap(Server, {
  adapter: PlatformExpress
});

export const handler = platform.handler();
