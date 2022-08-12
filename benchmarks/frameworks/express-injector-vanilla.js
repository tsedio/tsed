import express from "express";
import {InjectorService, LocalsContainer} from "@tsed/di";
import {v4} from "uuid";
import {levels} from "@tsed/logger";

const app = express();

app.disable("etag");
app.disable("x-powered-by");

const injector = new InjectorService();
const LEVELS = levels();

function createContext(opts) {
  let cache;
  let container;
  let stacks;
  let dateStart = new Date();

  return {
    id: opts.id,
    dateStart,
    get injector() {
      return injector;
    },
    get env() {
      return this.injector.settings.get("env");
    },
    get container() {
      return (container = container || new LocalsContainer());
    },
    get(key) {
      return cache?.get(key);
    },
    set(key, value) {
      (cache || new Map()).set(key, value);
      return this;
    },
    logger: {
      id: opts.id,
      dateStart,
      logger: opts.logger,
      additionalProps: opts.additionalProps,
      level: LEVELS[(opts.level || "all").toUpperCase()] || LEVELS.ALL,
      maxStackSize: opts.maxStackSize,

      get stacks() {
        return (stacks = stacks || []);
      }
    },

    cache(key, cb) {
      if (!this.has(key)) {
        this.set(key, cb());
      }

      return this.get(key);
    },

    async cacheAsync(key, cb) {
      if (!this.has(key)) {
        this.set(key, await cb());
      }

      return this.get(key);
    }
  };
}

app.use(async function contextMiddleware(req, res, next) {
  // const ctx = createContextPlatform(injector, {
  //   request: req,
  //   response: res
  // });
  const ctx = createContext({
    // logger: injector.logger,
    // event: {
    //   request: req,
    //   response: res
    // },
    // injector,
    id: v4()
  });
  next();
  // return runInContext(ctx, next);
});

app.get("/", function sendPayload(req, res) {
  res.json({hello: "world"});
});

(async function boostrap() {
  await injector.load();
  app.listen(3000);
})();
