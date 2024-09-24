import {DecoratorTypes, isArray} from "@tsed/core";

import type {JsonClassStore} from "../../domain/JsonClassStore.js";
import type {JsonParameterStore} from "../../domain/JsonParameterStore.js";
import {matchGroups} from "../../utils/matchGroups.js";
import {CustomKey} from "./customKey.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * @ignore
 */
function groupsClass(groups: any, entity: JsonClassStore) {
  const entries: [string, string[]][] = Object.entries(groups[0]);

  entity.children.forEach((propEntity) => {
    const groups = entries.filter(([, props]) => props.includes(propEntity.propertyName)).map(([key]) => key);
    const decorator: any = Groups(...groups);

    decorator(propEntity.target, propEntity.propertyKey);
  });
}

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
export function Groups<T>(groupName: string, groups: string[]): ParameterDecorator;
export function Groups(...groups: string[]): Function;
export function Groups(...groups: any): any {
  return JsonEntityFn((entity) => {
    switch (entity.decoratorType) {
      case DecoratorTypes.CLASS:
        groupsClass(groups, entity as JsonClassStore);
        break;
      case DecoratorTypes.PROP:
        CustomKey("x-groups", groups)(entity.target, entity.propertyKey);
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
        let groupsName = "";

        if (groups.length == 2 && isArray(groups[1])) {
          groupsName = groups[0];
          groups = groups[1];
        }

        (entity as JsonParameterStore).parameter.groups = groups;
        (entity as JsonParameterStore).parameter.groupsName = groupsName;
        break;
    }
  });
}
