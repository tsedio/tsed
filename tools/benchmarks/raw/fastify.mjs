// Fastify without Ts.ED: the ceiling of GET /hello on this platform.
import Fastify from "fastify";

import {failed, notifyReady, setupIpc} from "./ipc.js";

setupIpc();

const app = Fastify({logger: false});

app.get("/hello", () => "hello world");

app.listen({port: Number(process.env.PORT), host: "127.0.0.1"}).then(notifyReady, failed);
