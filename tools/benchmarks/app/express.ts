import {PlatformExpress} from "@tsed/platform-express";

import {failed, notifyReady, setupIpc} from "./ipc.js";
import {Server} from "./Server.js";

setupIpc();

try {
  const platform = await PlatformExpress.bootstrap(Server, {
    middlewares: [{use: "json-parser"}]
  });

  await platform.listen();
  notifyReady();
} catch (er) {
  failed(er);
}
