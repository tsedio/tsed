import express from "express";
import {InjectorService} from "@tsed/di";
import {PlatformContext} from "@tsed/common";
import {v4} from "uuid";

const app = express();

app.disable("etag");
app.disable("x-powered-by");

const injector = new InjectorService();

app.use(async (req, res, next) => {
  const ctx = new PlatformContext({
    logger: injector.logger,
    event: {
      request: req,
      response: res
    },
    injector,
    id: v4()
  });

  return ctx.runInContext(next);
});

app.get("/", function (req, res) {
  res.json({hello: "world"});
});

(async function boostrap() {
  await injector.load();
  app.listen(3000);
})();
