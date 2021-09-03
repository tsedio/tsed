import micromatch from "micromatch";

export function matchPath(path: string, patterns?: string[]) {
  return patterns && patterns.length ? micromatch.isMatch(path, patterns) : true;
}
