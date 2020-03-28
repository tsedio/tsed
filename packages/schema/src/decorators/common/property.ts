import {JsonSchemaStoreFn} from "./jsonSchemaStoreFn";

export function Property(type?: any) {
  return JsonSchemaStoreFn(store => {
    if (type) {
      store.itemSchema.type(type);
    }
  });
}
