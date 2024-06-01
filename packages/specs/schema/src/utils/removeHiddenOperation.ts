import {JsonMethodStore} from "../domain/JsonMethodStore.js";

export function removeHiddenOperation(operationStore: JsonMethodStore) {
  return !operationStore.store.get("hidden");
}
