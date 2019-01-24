import "reflect-metadata";
import {$log} from "ts-log-debug";

import {Server} from "./Server";

$log.debug("Start server...");
new Server()
  .start()
  .catch((er) => console.error(er));
