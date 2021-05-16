const Fastify = require("fastify");
const {printMemory} = require("../printMemory");

const fastify = Fastify();

fastify.get("/", async (req, reply) => {
  printMemory();
  return reply.send("Hello world!");
});
fastify.listen(process.env.PORT || 3000);
printMemory();
