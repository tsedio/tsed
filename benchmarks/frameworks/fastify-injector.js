import Fastify from "fastify";
import {InjectorService, runInContext} from "@tsed/di";
import {PlatformContext} from "@tsed/common";
import {v4} from "uuid";

const fastify = Fastify();
const injector = new InjectorService();

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

fastify.addHook("onRequest", (request, reply, done) => {
  const ctx = new PlatformContext({
    logger: injector.logger,
    event: {
      request: request,
      response: {
        set(key, value) {
          return reply.header(key, value);
        }
      }
    },
    injector,
    id: v4()
  });

  // Some code
  runInContext(ctx, done);
});

fastify.get("/", schema, function (req, reply) {
  reply.send({hello: "world"});
});

(async function boostrap() {
  await injector.load();
  fastify.listen(3000);
})();
