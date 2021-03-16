import micromatch from "micromatch";

export function matchGroups(groups: string[], compareWith: string[] = []) {
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
