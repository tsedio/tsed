import micro from "benchmarks/frameworks/micro.js";

const server = micro(async function (req, res) {
  return {hello: "world"};
});

server.listen(3000);
