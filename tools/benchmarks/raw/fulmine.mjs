// fulmine.js without Ts.ED: the ceiling of GET /hello on this platform.
import express from "fulmine.js";

import {failed, notifyReady, setupIpc} from "./ipc.js";

setupIpc();

const app = express();

app.get("/hello", (_req, res) => {
  res.send("hello world");
});

app.listen(Number(process.env.PORT), (error) => (error ? failed(error) : notifyReady()));
