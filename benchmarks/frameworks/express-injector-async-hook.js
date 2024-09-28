import {PlatformContext, PlatformRequest, PlatformResponse} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import express from "express";
import {v4} from "uuid";

const app = express();

app.disable("etag");
app.disable("x-powered-by");

const injector = new InjectorService();
const ResponseKlass = injector.getProvider(PlatformResponse)?.useClass;
const RequestKlass = injector.getProvider(PlatformRequest)?.useClass;

app.use(async (req, res, next) => {
  const ctx = new PlatformContext({
    ResponseKlass,
    RequestKlass,
    logger: injector.logger,
    event: {
      request: req,
      response: res
    },
    injector,
    id: v4()
  });

  ctx.response.onEnd(() => ctx.finish());

  await ctx.start();

  return ctx.runInContext(next);
});

app.get("/", function (req, res) {
  res.json({hello: "world"});
});

(async function boostrap() {
  await injector.load();
  app.listen(3000);
})();
