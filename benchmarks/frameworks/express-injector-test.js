import express from "express";
import {InjectorService, LocalsContainer} from "@tsed/di";
import {v4} from "uuid";
import {levels} from "@tsed/logger";

const app = express();

app.disable("etag");
app.disable("x-powered-by");

const injector = new InjectorService();
const LEVELS = levels();

class ContextLogger {
  id;
  dateStart;
  logger;
  additionalProps;
  level;
  maxStackSize;
  #stack;

  constructor({id, logger, dateStart = new Date(), level = "all", maxStackSize = 30, additionalProps}) {
    this.id = id;
    this.dateStart = dateStart;
    this.logger = logger;
    this.additionalProps = additionalProps;
    this.level = LEVELS[level.toUpperCase()] || LEVELS.ALL;
    this.maxStackSize = maxStackSize;
  }

  get stack() {
    return (this.#stack = this.#stack || []);
  }
}

class DIContext {
  #cache;
  #container;

  constructor(opts) {
    this.opts = opts;
    this.logger = new ContextLogger(opts);
  }

  get env() {
    return this.injector.settings.get("env");
  }

  /**
   * The request container used by the Ts.ED DI. It contain all services annotated with `@Scope(ProviderScope.REQUEST)`
   */
  get container() {
    return (this.#container = this.#container || new LocalsContainer());
  }

  get injector() {
    return this.opts.injector;
  }

  get(key) {
    return this.#cache?.get(key);
  }

  set(key, value) {
    this.#cache = (this.#cache || new Map()).set(key, value);
    return this;
  }

  cache(key, cb) {
    if (!this.has(key)) {
      this.set(key, cb());
    }

    return this.get(key);
  }

  async cacheAsync(key, cb) {
    if (!this.has(key)) {
      this.set(key, await cb());
    }

    return this.get(key);
  }
}

class PlatformContext extends DIContext {
  constructor(opts) {
    super(opts);
  }
}

app.use(async function contextMiddleware(req, res, next) {
  const ctx = new PlatformContext({
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
