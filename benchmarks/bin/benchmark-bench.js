"use strict";
import {Command} from "commander";
import inquirer from "inquirer";

import bench from "../src/bench.js";
import {choices, list} from "../src/packages.js";

const program = new Command();

program
  .option("-a, --all", "run all benchmarks")
  .option("-c, --connections <connections>", "Set the connections")
  .option("-p, --pipelining <pipelining>", "Set the pipelining")
  .option("-d, --duration <duration>", "Set the duration")
  .parse();

const opts = program.opts();
const options = {
  all: false,
  ...opts,
  connections: opts.connections ? +opts.connections : 100,
  pipelining: opts.pipelining ? +opts.pipelining : 10,
  duration: opts.duration ? +opts.duration : 40
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function run() {
  const modules = options.all ? choices : await select(list);
  return bench(options, modules);
}

async function select() {
  const result = await inquirer.prompt([
    {
      type: "checkbox",
      message: "Select packages",
      name: "list",
      choices: [new inquirer.Separator(" = The usual ="), ...list(), new inquirer.Separator(" = The extras = "), ...list(true)],
      validate: function (answer) {
        if (answer.length < 1) {
          return "You must choose at least one package.";
        }
        return true;
      }
    }
  ]);
  return result.list;
}
