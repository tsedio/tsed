import {Type} from "@tsed/core";
import {getJsonSchema} from "@tsed/schema";
import {defineStaticGetter} from "../utils/defineStaticGetter";

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
    defineStaticGetter(target, "tableName", () => tableName);
    defineStaticGetter(target, "jsonSchema", () => getJsonSchema(target));

    return target;
  };
}

export interface EntityMethods<T> extends Type<T> {
  readonly tableName: string;
}
