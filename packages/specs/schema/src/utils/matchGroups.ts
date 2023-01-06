import picomatch from "picomatch";

function micromatch(list: string[], patterns: string[]) {
  patterns = ([] as string[]).concat(patterns);
  list = ([] as string[]).concat(list);

  let omit = new Set();
  let keep = new Set();
  let items = new Set();
  let negatives = 0;

  let onResult = (state: any) => {
    items.add(state.output);
  };

  for (let i = 0; i < patterns.length; i++) {
    let isMatch: any = picomatch(String(patterns[i]), {onResult}, true);
    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;

    if (negated) {
      negatives++;
    }

    for (let item of list) {
      let matched = isMatch(item, true);

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
