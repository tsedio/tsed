import {getJsonSchema} from "@tsed/common";

export function Entity(tableName: string): ClassDecorator {
  if (!tableName) {
    throw new Error("Please provide a table name");
  }

  return (target) => {
    Object.defineProperty(target, "tableName", {
      get() {
        return tableName;
      }
    });

    Object.defineProperty(target, "jsonSchema", {
      get() {
        return getJsonSchema(target as any);
      }
    });
  };
}
