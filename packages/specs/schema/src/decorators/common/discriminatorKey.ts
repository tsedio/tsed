import {useDecorators} from "@tsed/core";
import {JsonPropertyStore} from "../../domain/JsonPropertyStore";
import {JsonEntityFn} from "./jsonEntityFn";
import {Property} from "./property";

export function DiscriminatorKey(): PropertyDecorator {
  return useDecorators(
    Property(),
    JsonEntityFn((store: JsonPropertyStore) => {
      store.discriminatorKey();
    })
  );
}
