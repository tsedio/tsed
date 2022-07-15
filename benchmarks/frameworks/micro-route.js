import micro from "benchmarks/frameworks/micro.js";
import dispatch from "micro-route/dispatch.js";

const handler = (req, res) => micro.send(res, 200, {hello: "world"});

const server = micro(dispatch("/", "GET", handler));

server.listen(3000);
