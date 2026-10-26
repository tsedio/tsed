// Print the functions with the most self time in a V8 .cpuprofile (from node --cpu-prof).
// Usage: node profile-summary.mjs <file.cpuprofile> [count]
import {readFileSync} from "node:fs";

const [file, count = "30"] = process.argv.slice(2);

if (!file) {
  console.error("Usage: node profile-summary.mjs <file.cpuprofile> [count]");
  process.exit(1);
}

const profile = JSON.parse(readFileSync(file, "utf8"));
const nodes = new Map(profile.nodes.map((node) => [node.id, node]));
const selfTime = new Map();
let total = 0;

profile.samples.forEach((id, index) => {
  const delta = profile.timeDeltas[index] || 0;
  const {functionName, url, lineNumber} = nodes.get(id).callFrame;
  const key = `${functionName || "(anonymous)"} ${url.split("/").slice(-2).join("/")}:${lineNumber + 1}`;

  selfTime.set(key, (selfTime.get(key) || 0) + delta);
  total += delta;
});

[...selfTime.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, Number(count))
  .forEach(([key, time]) => console.log(`${((time / total) * 100).toFixed(1).padStart(5)}%  ${key}`));
