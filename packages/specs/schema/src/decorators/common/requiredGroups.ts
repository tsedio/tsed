import {DecoratorTypes} from "@tsed/core";
import {matchGroups} from "../../utils/matchGroups";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Apply groups validation strategy for required property.
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 */
export function RequiredGroups(...groups: string[]): Function {
  return JsonEntityFn((entity) => {
    if (entity.decoratorType === DecoratorTypes.PROP) {
      entity.parent.schema.$hooks.on("requiredGroups", (required: string[], givenGroups: string[]) => {
        if (matchGroups(groups, givenGroups)) {
          return required.filter((key: string) => key !== entity.propertyKey);
        }

        return required;
      });
    }
  });
}
