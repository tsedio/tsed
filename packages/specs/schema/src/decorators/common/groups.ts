import {DecoratorTypes, isArray} from "@tsed/core";

import type {JsonClassStore} from "../../domain/JsonClassStore.js";
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
    if (entity.is(DecoratorTypes.CLASS)) {
      groupsClass(groups, entity as JsonClassStore);
      return;
    }

    if (entity.is(DecoratorTypes.PROP)) {
      entity.schema.groups(groups, true);
      return;
    }

    if (entity.is(DecoratorTypes.PARAM)) {
      let groupsName = "";

      if (groups.length == 2 && isArray(groups[1])) {
        groupsName = groups[0];
        groups = groups[1];
      }

      entity.parameter.schema().groups(groups).groupsName(groupsName);
    }
  });
}
