import {Server} from "./Server";
import {PlatformExpress} from "@tsed/platform-express";

const fs = require("fs");
const chalk = require("chalk");

const TIME_TICK = 1000;
const DURATION = 80000;

const stats: any[] = [[], []];
let timestamp = 0;
let last = 0;

async function bootstrap() {
  const server = await PlatformExpress.bootstrap(Server);
  await server.listen();
}

bootstrap();

const write = () => {
  const data = JSON.stringify(stats);
  fs.writeFile(__dirname + "/../.tmp/stats.json", data, (err: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log("\nSaved stats to stats.json");
    }
    process.exit();
  });
};
process.on("SIGINT", write);

const onTick = () => {
  try {
    global.gc();
  } catch (e) {
    console.log("You must run program with 'node --expose-gc index.js' or 'npm start'");
    process.exit();
  }
  const heapUsed = process.memoryUsage().heapUsed;
  stats[0].push(timestamp);
  stats[1].push(heapUsed);
  timestamp += TIME_TICK;
  if (last) {
    console.log("Memory heap => ", heapUsed, heapUsed - last > 0 ? chalk.red("+") : chalk.green("-"));
  }
  last = heapUsed;
};

setInterval(onTick, TIME_TICK);
setTimeout(write, DURATION);
