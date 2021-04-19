import {cleanObject} from "@tsed/core";

export function transformTypes(obj: any) {
  const nullable = obj.type.includes("null") ? true : undefined;

  const types = obj.type.reduce((types: string[], type: string) => {
    if (type !== "null") {
      return [...types, cleanObject({type, nullable})];
    }
    return types;
  }, []);

  if (types.length > 1) {
    obj.oneOf = types;
  } else {
    obj.type = types[0].type;
    obj.nullable = types[0].nullable;
  }

  return obj;
}
