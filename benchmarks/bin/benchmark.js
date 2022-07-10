#!/usr/bin/env node
import {Command} from "commander";
const program = new Command();

program
  .command("bench", "Benchmark one, multiple or all modules.", {isDefault: true})
  .command("compare", "Compare results by module.")
  .parse(process.argv);
