import Fastify from "fastify";

const fastify = Fastify();

const schema = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          hello: {
            type: "string"
          }
        }
      }
    }
  }
};

fastify.get("/", schema, function (req, reply) {
  reply.send({hello: "world"});
});

fastify.listen(3000);
