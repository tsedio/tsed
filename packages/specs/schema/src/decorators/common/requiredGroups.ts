import {matchGroups} from "../../utils/matchGroups.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Apply groups validation strategy for required property.
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 */
export function RequiredGroups(...groups: string[]): PropertyDecorator {
  return JsonEntityFn((entity) => {
    entity.parent.schema.$hooks.on("requiredGroups", (required: string[], givenGroups: string[]) => {
      if (matchGroups(groups, givenGroups)) {
        return required.filter((key: string) => key !== entity.propertyKey);
      }

      return required;
    });
  });
}
