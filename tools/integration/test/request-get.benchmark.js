const {PerfLogger} = require("packages/perf");
const axios = require("axios");
const {PlatformExpress} = require("@tsed/platform-express");
const {Server} = require("../lib/cjs/Server.js");

async function bootstrap() {
  const platform = await PlatformExpress.bootstrap(Server, {
    logger: {level: "off"},
    port: 8999
  });

  await platform.listen();

  const perf = PerfLogger.get("bootstrap");
  perf.start();

  for (let i = 0; i < 10000; i++) {
    await axios.get("http://localhost:8999/rest/hello-world");
    perf.log("Iteration -", i);
  }

  perf.end();

  await platform.stop();
}

bootstrap();
