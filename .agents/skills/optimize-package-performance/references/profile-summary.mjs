// Print the functions with the most self time in V8 .cpuprofile files (from node --cpu-prof), one table per file.
// Usage: node profile-summary.mjs [--top=30] <file.cpuprofile>...
import {readFileSync} from "node:fs";

const args = process.argv.slice(2);
const topArg = args.find((arg) => arg.startsWith("--top="));
const top = topArg ? Number(topArg.slice("--top=".length)) : 30;
const files = args.filter((arg) => !arg.startsWith("--"));

if (!files.length || !Number.isInteger(top) || top <= 0) {
  console.error("Usage: node profile-summary.mjs [--top=30] <file.cpuprofile>...");
  process.exit(1);
}

function shortUrl(url) {
  return url.split("/").slice(-2).join("/");
}

function summarize(file) {
  const profile = JSON.parse(readFileSync(file, "utf8"));
  const nodes = new Map(profile.nodes.map((node) => [node.id, node]));
  // keyed by the full url, so functions with the same name and line in different files stay apart
  const selfTime = new Map();
  let total = 0;

  profile.samples.forEach((id, index) => {
    const delta = profile.timeDeltas[index] || 0;
    const {functionName, url, lineNumber} = nodes.get(id).callFrame;
    const key = `${functionName || "(anonymous)"}\0${url}\0${lineNumber + 1}`;
    const entry = selfTime.get(key) || {functionName: functionName || "(anonymous)", url, line: lineNumber + 1, time: 0};

    entry.time += delta;
    selfTime.set(key, entry);
    total += delta;
  });

  console.log(`\n${file}`);

  [...selfTime.values()]
    .sort((a, b) => b.time - a.time)
    .slice(0, top)
    .forEach(({functionName, url, line, time}) => {
      console.log(`${((time / total) * 100).toFixed(1).padStart(5)}%  ${functionName} ${shortUrl(url)}:${line}`);
    });
}

files.forEach(summarize);
