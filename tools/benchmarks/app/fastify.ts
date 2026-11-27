import {PlatformFastify} from "@tsed/platform-fastify";

import {failed, notifyReady, setupIpc} from "./ipc.js";
import {Server} from "./Server.js";

setupIpc();

try {
  const platform = await PlatformFastify.bootstrap(Server, {
    plugins: ["@fastify/accepts"]
  });

  await platform.listen();
  notifyReady();
} catch (er) {
  failed(er);
}
