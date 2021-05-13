const Fastify = require("fastify");

const fastify = Fastify();

fastify.get("/", async (req, reply) => reply.send("Hello world!"));
fastify.listen(process.env.PORT || 3000);
