import {DecoratorTypes} from "@tsed/core";
import micromatch from "micromatch";
import {JsonEntityFn} from "./jsonEntityFn";

function matchGroups(groups: string[], compareWith: string[] = []) {
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

export function Groups(...groups: string[]): Function {
  return JsonEntityFn((entity) => {
    if (entity.decoratorType === DecoratorTypes.PROP) {
      entity.schema.$hooks.on("groups", (prev: boolean, givenGroups: string[]) => {
        if (!prev) {
          if (matchGroups(groups, givenGroups)) {
            return true;
          }
        }

        return prev;
      });
    }

    if (entity.decoratorType === DecoratorTypes.PARAM) {
      entity.parameter!.groups = groups;
    }
  });
}
