const {PerfLogger} = require("@tsed/perf");
const {PlatformExpress} = require("@tsed/platform-express");
const {createContext} = require("@tsed/common");
const {Server} = require("../lib/cjs/Server.js");

function createEvent() {
  return {
    request: {
      headers: {},
      get(key) {
        return this.headers[key];
      }
    },
    response: {
      headers: {},
      set(key, value) {
        this.headers[key] = value;
        return this;
      }
    }
  };
}

async function bootstrap() {
  const platform = PlatformExpress.create(Server, {
    logger: {level: "off"}
  });
  const invokeContext = createContext(platform.injector);

  const perf = PerfLogger.get("bootstrap");
  perf.start();

  for (let i = 0; i < 100000; i++) {
    invokeContext(createEvent());
    // perf.log("Iteration -", i);
  }

  perf.end();

  await platform.stop();
}

bootstrap();
