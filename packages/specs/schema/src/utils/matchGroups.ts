import picomatch from "picomatch";

/**
 * Compiled matchers per pattern. Patterns can come from the request (`includes`), so the cache is bounded.
 * @ignore
 */
const MATCHERS = new Map<string, any>();
const MAX_MATCHERS = 1000;

function getMatcher(pattern: string) {
  let isMatch = MATCHERS.get(pattern);

  if (!isMatch) {
    isMatch = picomatch(pattern, {}, true);

    if (MATCHERS.size >= MAX_MATCHERS) {
      MATCHERS.clear();
    }

    MATCHERS.set(pattern, isMatch);
  }

  return isMatch;
}

function micromatch(list: string[], patterns: string[]) {
  patterns = ([] as string[]).concat(patterns);
  list = ([] as string[]).concat(list);

  let omit = new Set();
  let keep = new Set();
  let items = new Set();
  let negatives = 0;

  for (let i = 0; i < patterns.length; i++) {
    let isMatch: any = getMatcher(String(patterns[i]));
    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;

    if (negated) {
      negatives++;
    }

    for (let item of list) {
      let matched = isMatch(item, true);
      // same as the picomatch onResult option: collect the output of every tested item
      items.add(matched.output);

      let match = negated ? !matched.isMatch : matched.isMatch;
      if (!match) continue;

      if (negated) {
        omit.add(matched.output);
      } else {
        omit.delete(matched.output);
        keep.add(matched.output);
      }
    }
  }

  let result = negatives === patterns.length ? [...items] : [...keep];
  return !!result.filter((item) => !omit.has(item)).length;
}

/**
 * @ignore
 */
export function matchGroups(groups: string[], compareWith: string[] = []) {
  const groupsExcludes = groups.filter((group) => group.startsWith("!")).map((group) => group.replace("!", ""));
  const groupsIncludes = groups.filter((group) => !group.startsWith("!"));

  if (groupsExcludes.length) {
    if (compareWith.length && micromatch(groupsExcludes, compareWith)) {
      return true;
    }
  }

  if (groupsIncludes.length) {
    return !micromatch(
      groups.filter((group) => !group.startsWith("!")),
      compareWith
    );
  }

  return false;
}
