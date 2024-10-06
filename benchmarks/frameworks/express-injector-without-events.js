import {PlatformContext, PlatformRequest, PlatformResponse} from "@tsed/common";
import {InjectorService, runInContext, setContext} from "@tsed/di";
import express from "express";
import http from "http";
import {v4} from "uuid";

const injector = new InjectorService();
const app = express();
const server = http.createServer({}, (req, res) => {
  runInContext(undefined, () => app(req, res), injector);
});

app.disable("etag");
app.disable("x-powered-by");

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

  setContext(ctx);

  return next();
});

app.get("/", function (req, res) {
  res.json({hello: "world"});
});

(async function boostrap() {
  await injector.load();
  server.listen(3000);
})();
