import autocannon from "autocannon";
import autoCompare from "autocannon-compare";
import fs from "fs";
import path from "path";
import {promisify} from "util";

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

const resultsDirectory = path.join(process.cwd(), "results");

const run = (opts = {}) =>
  new Promise((resolve, reject) => {
    opts.url = "http://0.0.0.0:3000";
    autocannon(opts, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

const writeResult = async (handler, result) => {
  try {
    await access(resultsDirectory);
  } catch (e) {
    await mkdir(resultsDirectory);
  }

  result.server = handler;

  const dest = path.join(resultsDirectory, `${handler}.json`);
  return writeFile(dest, JSON.stringify(result));
};

export async function fire(opts, handler, save) {
  const result = await run(opts);
  return save ? writeResult(handler, result) : null;
}

export function compare(a, b) {
  const resA = require(`${resultsDirectory}/${a}.json`);
  const resB = require(`${resultsDirectory}/${b}.json`);
  const comp = autoCompare(resA, resB);
  if (comp.equal) {
    return true;
  } else if (comp.aWins) {
    return {
      diff: comp.requests.difference,
      fastest: a,
      slowest: b,
      fastestAverage: resA.requests.average,
      slowestAverage: resB.requests.average
    };
  }
  return {
    diff: autoCompare(resB, resA).requests.difference,
    fastest: b,
    slowest: a,
    fastestAverage: resB.requests.average,
    slowestAverage: resA.requests.average
  };
}
