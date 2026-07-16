import fs from "node:fs";
import {globby} from "globby";

const files = await globby([
  "packages/**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs}",
  "!**/coverage/**",
  "!**/lib/**",
  "!**/dist/**",
  "!**/snapshots/**",
  "!**/templates/**",
  "!**/docs/**",
  "!**/docs-references/**",
  "!**/.nyc_output/**",
  "!**/generated/**",
  "!**/node_modules/**"
]);

const patterns = [/(?:from|import)\s*\(\s*["'](@tsed\/[^"']+\/src\/[^"']+)["']/g, /from\s*["'](@tsed\/[^"']+\/src\/[^"']+)["']/g];

const violations = [];

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");

  for (const pattern of patterns) {
    pattern.lastIndex = 0;

    for (const match of source.matchAll(pattern)) {
      const index = match.index ?? 0;
      const line = source.slice(0, index).split("\n").length;

      violations.push({
        file,
        line,
        specifier: match[1]
      });
    }
  }
}

if (violations.length) {
  console.error("Invalid workspace imports detected:");

  for (const violation of violations) {
    console.error(`- ${violation.file}:${violation.line} imports ${violation.specifier}`);
  }

  process.exit(1);
}
