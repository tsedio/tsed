import {DecoratorTypes} from "@tsed/core";
import micromatch from "micromatch";
import {matchGroups} from "../../utils/matchGroups";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Apply groups validation strategy
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 */
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
