// Express without Ts.ED: the ceiling of GET /hello on this platform.
import express from "express";

import {failed, notifyReady, setupIpc} from "./ipc.js";

setupIpc();

const app = express();

app.get("/hello", (_req, res) => {
  res.send("hello world");
});

const server = app.listen(Number(process.env.PORT), notifyReady);
server.on("error", failed);
