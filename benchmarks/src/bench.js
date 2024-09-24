#!/usr/bin/env node
import {execa} from "execa";
import ora from "ora";
import path from "path";
import {fileURLToPath} from "url";

import {fire} from "./autocannon.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const doBench = async (opts, handler) => {
  const spinner = ora(`Started ${handler}`).start();
  const modPath = path.join(__dirname, "..", "frameworks", handler);

  const abortController = new AbortController();
  const subprocess = execa("node", [modPath], {signal: abortController.signal});
  subprocess.stdout.on("data", (data) => {
    console.log(data.toString());
  });
  try {
    spinner.color = "magenta";
    spinner.text = `Warming ${handler}`;
    await fire(opts, handler, false);
  } catch (error) {
    return console.log(error);
  } finally {
    spinner.color = "yellow";
    spinner.text = `Working ${handler}`;
  }

  try {
    await fire(opts, handler, true);
    abortController.abort();
    try {
      await subprocess;
    } catch (error) {
      if (!subprocess.killed) {
        subprocess.kill("SIGTERM", {
          forceKillAfterTimeout: 2000
        });
      }
    }
    // forked.kill("SIGINT");
    spinner.text = `Results saved for ${handler}`;
    spinner.succeed();
    return true;
  } catch (error) {
    return console.log(error);
  }
};

let index = 0;
const start = async (opts, list) => {
  if (list.length === index) {
    return true;
  }

  try {
    await doBench(opts, list[index]);
    index += 1;
    return start(opts, list);
  } catch (error) {
    return console.log(error);
  }
};

export default start;
