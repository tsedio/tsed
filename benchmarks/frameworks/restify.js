import restify from "benchmarks/frameworks/restify.js";

const server = restify.createServer();
server.get("/", function (req, res) {
  res.send({hello: "world"});
});

server.listen(3000);
