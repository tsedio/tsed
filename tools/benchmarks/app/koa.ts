import {PlatformKoa} from "@tsed/platform-koa";

import {failed, notifyReady, setupIpc} from "./ipc.js";
import {Server} from "./Server.js";

setupIpc();

try {
  const platform = await PlatformKoa.bootstrap(Server, {
    middlewares: ["koa-bodyparser"]
  });

  await platform.listen();
  notifyReady();
} catch (er) {
  failed(er);
}
