import {useDecorators} from "@tsed/core";

import {JsonPropertyStore} from "../../domain/JsonPropertyStore.js";
import {JsonEntityFn} from "./jsonEntityFn.js";
import {Property} from "./property.js";

export function DiscriminatorKey(): PropertyDecorator {
  return useDecorators(
    Property(),
    JsonEntityFn((store: JsonPropertyStore) => {
      store.discriminatorKey();
    })
  );
}
