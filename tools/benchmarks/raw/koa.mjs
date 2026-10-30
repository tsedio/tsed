// Koa without Ts.ED: the ceiling of GET /hello on this platform.
import Router from "@koa/router";
import Koa from "koa";

import {failed, notifyReady, setupIpc} from "./ipc.js";

setupIpc();

const app = new Koa();
const router = new Router();

router.get("/hello", (ctx) => {
  ctx.body = "hello world";
});

app.use(router.routes());

const server = app.listen(Number(process.env.PORT), notifyReady);
server.on("error", failed);
