#!/usr/bin/env node
import chalk from "chalk";
import Table from "cli-table";
import {Command} from "commander";
import {readdirSync, readFileSync, writeFileSync} from "fs";
import inquirer from "inquirer";
import os from "os";
import {join} from "path";

import {compare} from "../src/autocannon.js";
import {info} from "../src/packages.js";

const commander = new Command();

const resultsPath = join(process.cwd(), "results");

commander
  .option("-t, --table", "print table")
  .option("-m --markdown", "format table for markdown")
  .option("-u --update", "update README.md")
  .parse(process.argv);

const opts = commander.opts();

if (opts.markdown || opts.update) {
  chalk.level = 0;
}

if (!getAvailableResults().length) {
  console.log(chalk.red("Benchmark to gather some results to compare."));
} else if (opts.update) {
  const result = compareResults(true);
  updateFile("README.md", result);
  updateFile("ISSUE_COMMENT.md", result);
} else if (opts.table) {
  console.log(compareResults(opts.markdown));
} else {
  compareResultsInteractive();
}

function getAvailableResults() {
  return readdirSync(resultsPath)
    .filter((file) => file.match(/(.+)\.json$/))
    .sort()
    .map((choice) => choice.replace(".json", ""));
}

function formatHasRouter(hasRouter) {
  return typeof hasRouter === "string" ? hasRouter : hasRouter ? "✓" : "✗";
}

function updateFile(file, result) {
  const machineInfo = `${os.platform()} ${os.arch()} | ${os.cpus().length} vCPUs | ${(os.totalmem() / 1024 ** 3).toFixed(1)}GB Mem`;
  const benchmarkMd = `# Benchmarks

* __Machine:__ ${machineInfo}
* __Node:__ \`${process.version}\`
* __Run:__ ${new Date()}
* __Method:__ \`autocannon -c 100 -d 10 -p 10 localhost:3000\` (two rounds; one to warm-up, one to measure)

${result}

## Explanation

The benchmark shows a performance difference between the frameworks. We note that Ts.ED is often last. In fact, Ts.ED uses features useful to a production application which reduce its performance.

For example, Ts.ED initializes a sandbox (async_hook) for each request in order to work in an isolated context if necessary.
It also initializes the elements necessary for monitoring requests in a log manager.

All this at a necessary cost that reflects the reality of a production application ;)
`;
  const md = readFileSync(file, "utf8");
  writeFileSync(file, md.split("# Benchmarks")[0] + benchmarkMd, "utf8");
}

function compareResults(markdown) {
  const tableStyle = !markdown
    ? {}
    : {
        chars: {
          top: "",
          "top-left": "",
          "top-mid": "",
          "top-right": "",
          bottom: "",
          "bottom-left": "",
          "bottom-mid": "",
          "bottom-right": "",
          mid: "",
          "left-mid": "",
          "mid-mid": "",
          "right-mid": "",
          left: "|",
          right: "|",
          middle: "|"
        },
        style: {
          border: [],
          head: []
        }
      };

  const table = new Table({
    ...tableStyle,
    head: ["", "Version", "Router", "Requests/s", "Latency", "Throughput/Mb"]
  });

  if (markdown) {
    table.push([":--", "--:", "--:", ":-:", "--:", "--:"]);
  }

  const results = getAvailableResults()
    .map((file) => {
      const content = readFileSync(`${resultsPath}/${file}.json`);
      return JSON.parse(content.toString());
    })
    .sort((a, b) => parseFloat(b.requests.mean) - parseFloat(a.requests.mean));

  const outputResults = [];
  const formatThroughput = (throughput) => (throughput ? (throughput / 1024 / 1024).toFixed(2) : "N/A");

  for (const result of results) {
    const beBold = result.server === "fastify";
    const {hasRouter, version} = info(result.server) || {};
    const {
      requests: {average: requests},
      latency: {average: latency},
      throughput: {average: throughput}
    } = result;

    if (version) {
      outputResults.push({
        name: result.server,
        version,
        hasRouter,
        requests: requests ? requests.toFixed(1) : "N/A",
        latency: latency ? latency.toFixed(2) : "N/A",
        throughput: formatThroughput(throughput)
      });

      table.push([
        bold(beBold, chalk.blue(result.server)),
        bold(beBold, version),
        bold(beBold, formatHasRouter(hasRouter)),
        bold(beBold, requests ? requests.toFixed(1) : "N/A"),
        bold(beBold, latency ? latency.toFixed(2) : "N/A"),
        bold(beBold, throughput ? (throughput / 1024 / 1024).toFixed(2) : "N/A")
      ]);
    }
  }

  writeFileSync("benchmark-results.json", JSON.stringify(outputResults), "utf8");

  return table.toString();
}

async function compareResultsInteractive() {
  let choices = getAvailableResults();

  const firstChoice = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What's your first pick?",
      choices
    }
  ]);

  choices = choices.filter((choice) => choice !== firstChoice.choice);

  const secondChoice = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What's your second one?",
      choices
    }
  ]);

  const [a, b] = [firstChoice.choice, secondChoice.choice];
  const result = compare(a, b);

  const fastest = chalk.bold.yellow(result.fastest);
  const fastestAverage = chalk.green(result.fastestAverage);
  const slowest = chalk.bold.yellow(result.slowest);
  const slowestAverage = chalk.green(result.slowestAverage);
  const diff = chalk.bold.green(result.diff);

  if (result === true) {
    console.log(chalk.green.bold(`${a} and ${b} both are fast!`));
    return;
  }

  console.log(`
 ${chalk.blue("Both are awesome but")} ${fastest} ${chalk.blue("is")} ${diff} ${chalk.blue("faster than")} ${slowest}
 • ${fastest} ${chalk.blue("request average is")} ${fastestAverage}
 • ${slowest} ${chalk.blue("request average is")} ${slowestAverage}`);
}

function bold(writeBold, str) {
  return writeBold ? chalk.bold(str) : str;
}
