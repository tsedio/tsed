"use strict";
import inquirer from "inquirer";
import bench from "../src/bench.js";
import {choices, list} from "../src/packages.js";

const argv = process.argv.slice(2);

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function run() {
  const options = await getBenchmarkOptions();
  const modules = options.all ? choices : await select(list);
  return bench(options, modules);
}

async function getBenchmarkOptions() {
  if (argv.length) return parseArgv();
  return inquirer.prompt([
    {
      type: "confirm",
      name: "all",
      message: "Do you want to run all benchmark tests?",
      default: false
    },
    {
      type: "input",
      name: "connections",
      message: "How many connections do you need?",
      default: 100,
      validate(value) {
        return !Number.isNaN(parseFloat(value)) || "Please enter a number";
      },
      filter: Number
    },
    {
      type: "input",
      name: "pipelining",
      message: "How many pipelines do you need?",
      default: 10,
      validate(value) {
        return !Number.isNaN(parseFloat(value)) || "Please enter a number";
      },
      filter: Number
    },
    {
      type: "input",
      name: "duration",
      message: "How long should it take?",
      default: 40,
      validate(value) {
        return !Number.isNaN(parseFloat(value)) || "Please enter a number";
      },
      filter: Number
    }
  ]);
}

function parseArgv() {
  const [all, connections, pipelining, duration] = argv;
  return {
    all: all === "y",
    connections: +connections,
    pipelining: +pipelining,
    duration: +duration
  };
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
