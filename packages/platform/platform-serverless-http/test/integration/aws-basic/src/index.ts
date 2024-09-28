import {PlatformExpress} from "@tsed/platform-express";

import {PlatformServerlessHttp} from "../../../..";
import {Server} from "./Server.js";

const platform = PlatformServerlessHttp.bootstrap(Server, {
  adapter: PlatformExpress
});

export const handler = platform.handler();
