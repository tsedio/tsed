import chalk from "chalk";
import logger from "fancy-log";
import fs from "fs-extra";
import {join} from "path";
import {BENCHMARK_OPTIONS} from "./constants";
import {BenchmarkOptions} from "./interfaces/Benchmarks";
import {getBenchmarks} from "./utils/getBenchmarks";
import {getReport} from "./utils/getReport";

const markdownTable = require("markdown-table");

const Table = require("cli-table3");

export async function checkBenchmark(options: BenchmarkOptions) {
  const file = join(options.outDir, "benchmarks.json");
  logger.info(chalk.cyan("Start benchmarks..."));
  logger.info(chalk.cyan("Threads:"), chalk.red(options.threads));
  logger.info(chalk.cyan("Duration:"), chalk.red(options.duration));
  logger.info(chalk.cyan("Connections:"), chalk.red(options.connections));
  logger.info(chalk.cyan("Libs:"), options.libs.map((s) => chalk.green(s.label)).join(", "));

  const {benchmarks: baseline}: any = fs.existsSync(file) ? require(file) : {};
  const currentBenchmarks = await getBenchmarks(options);
  const {
    description,
    statistics: [head, ...statistics]
  } = getReport(currentBenchmarks, baseline, options);

  const table = new Table({
    head
  });

  table.push(...statistics);

  logger.info();
  logger.info(description + "\n" + table);
  logger.info();

  logger.info(chalk.cyan("Export report..."));
  fs.ensureDirSync(options.outDir);
  fs.writeFileSync(
    join(options.outDir, "benchmarks.json"),
    JSON.stringify(
      {
        description,
        createdAt: new Date(),
        benchmarks: currentBenchmarks,
        results: table
      },
      null,
      2
    ),
    {encoding: "utf8"}
  );

  const templatePath = join(__dirname, "..", "templates", "template.md");
  const content = fs
    .readFileSync(templatePath, {encoding: "utf8"})
    .replace("{{description}}", description)
    .replace("{{table}}", markdownTable([head, ...statistics]));

  fs.writeFileSync(join(options.outDir, "benchmarks.md"), content, {encoding: "utf8"});

  logger.info(chalk.cyan("Export report..."), "done");
}

checkBenchmark(BENCHMARK_OPTIONS);
