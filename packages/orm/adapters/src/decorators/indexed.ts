import {JsonEntityFn} from "@tsed/schema";

export function Indexed(): PropertyDecorator {
  return JsonEntityFn((entity) => {
    entity.store.set("adapter:indexed", {});
  });
}
