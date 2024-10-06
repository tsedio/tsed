import {Type} from "@tsed/core";
import {getJsonSchema} from "@tsed/schema";

import {defineStaticGetter} from "../utils/defineStaticGetter.js";
import {getJsonEntityRelationships} from "../utils/getJsonEntityRelationships.js";

/**
 *
 * @param tableName
 * @decorator
 * @objection
 */
export function Entity(tableName: string): ClassDecorator {
  if (!tableName) {
    throw new Error("Please provide a table name");
  }

  return (target: any) => {
    const originalRelationMappings = target["relationMappings"];
    defineStaticGetter(target, "tableName", () => tableName);
    defineStaticGetter(target, "jsonSchema", () => getJsonSchema(target));
    defineStaticGetter(target, "relationMappings", () => originalRelationMappings || getJsonEntityRelationships(target));
    return target;
  };
}

export interface EntityMethods<T> extends Type<T> {
  readonly tableName: string;
}
