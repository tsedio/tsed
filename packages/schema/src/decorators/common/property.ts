import {JsonEntityFn} from "./jsonEntityFn";

export function Property(type?: any) {
  return JsonEntityFn(store => {
    if (type) {
      store.itemSchema.type(type);
    }
  });
}
