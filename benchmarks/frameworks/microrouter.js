import micro from "benchmarks/frameworks/micro.js";
import microRouter, {router} from "benchmarks/frameworks/microrouter.js";

const hello = async function (req, res) {
  return micro.send(res, 200, {hello: "world"});
};

const server = micro(router(microRouter.get("/", hello)));

server.listen(3000);
