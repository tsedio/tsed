import {PlatformContext} from "@tsed/common";
import {getContext, InjectorService, runInContext} from "@tsed/di";
import Fastify from "fastify";
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

  ctx.start().then(() => {
    runInContext(ctx, done);
  });
});

fastify.addHook("onResponse", (request, reply, done) => {
  const ctx = getContext();
  ctx.finish();
  done();
});

fastify.get("/", schema, function (req, reply) {
  reply.send({hello: "world"});
});

(async function boostrap() {
  await injector.load();
  fastify.listen(3000);
})();
