const {$log} = require("@tsed/logger");
const {PerfLogger} = require("@tsed/perf");
const {PlatformExpress} = require("@tsed/platform-express");
const {Server} = require("../lib/cjs/Server.js");

async function bootstrap() {
  const perf = PerfLogger.get("bootstrap");
  perf.start();

  for (let i = 0; i < 10000; i++) {
    try {
      const platform = await PlatformExpress.bootstrap(Server, {
        logger: {level: "off"}
      });
      await platform.listen();

      process.on("SIGINT", () => {
        platform.stop();
      });

      await platform.stop();
      perf.log("Iteration -", i);
    } catch (error) {
      $log.error({event: "SERVER_BOOTSTRAP_ERROR", error});
    }
  }

  perf.end();
}

bootstrap();
