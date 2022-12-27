import micromatch from "micromatch";
import picomatch from "picomatch";

/**
 * @ignore
 */
function matcher(patterns: string[], expected: string[]) {
  const isMatch = picomatch(patterns);

  return expected.some((pattern) => isMatch(pattern));
}

export function _matchGroups(groups: string[], compareWith: string[] = []) {
  const groupsExcludes = groups.filter((group) => group.startsWith("!")).map((group) => group.replace("!", ""));
  const groupsIncludes = groups.filter((group) => !group.startsWith("!"));

  if (groupsExcludes.length) {
    if (compareWith.length && micromatch(groupsExcludes, compareWith).length) {
      return true;
    }
  }

  if (groupsIncludes.length) {
    return !micromatch(
      groups.filter((group) => !group.startsWith("!")),
      compareWith
    ).length;
  }

  return false;
}

/**
 * @ignore
 */
export function matchGroups(groups: string[], compareWith: string[] = []) {
  const groupsExcludes = groups.filter((group) => group.startsWith("!")).map((group) => group.replace("!", ""));
  const groupsIncludes = groups.filter((group) => !group.startsWith("!"));

  if (groupsExcludes.length) {
    if (compareWith.length && matcher(compareWith, groupsExcludes)) {
      return true;
    }
  }

  if (groupsIncludes.length) {
    return !matcher(
      compareWith,
      groups.filter((group) => !group.startsWith("!"))
    );
  }

  return false;
}
