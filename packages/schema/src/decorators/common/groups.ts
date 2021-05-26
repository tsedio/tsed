import {DecoratorTypes} from "@tsed/core";
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
export function Groups<T>(groupsDefinition: Record<string, (keyof T)[]>): ClassDecorator;
export function Groups(...groups: string[]): Function;
export function Groups(...groups: any): any {
  return JsonEntityFn((entity) => {
    switch (entity.decoratorType) {
      case DecoratorTypes.CLASS:
        const entries: [string, string[]][] = Object.entries(groups[0]);

        entity.children.forEach((propEntity) => {
          const groups = entries.filter(([, props]) => props.includes(propEntity.propertyName)).map(([key]) => key);
          const decorator = Groups(...groups);

          decorator(propEntity.target, propEntity.propertyKey);
        });
        break;
      case DecoratorTypes.PROP:
        entity.schema.$hooks.on("groups", (prev: boolean, givenGroups: string[]) => {
          if (!prev) {
            if (matchGroups(groups, givenGroups)) {
              return true;
            }
          }

          return prev;
        });
        break;
      case DecoratorTypes.PARAM:
        entity.parameter!.groups = groups;
        break;
    }
  });
}
