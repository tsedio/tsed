import {PlatformFulmine} from "@tsed/platform-fulmine";

import {failed, notifyReady, setupIpc} from "./ipc.js";
import {Server} from "./Server.js";

setupIpc();

try {
  const platform = await PlatformFulmine.bootstrap(Server, {
    middlewares: [{use: "json-parser"}]
  });

  await platform.listen();
  notifyReady();
} catch (er) {
  failed(er);
}
