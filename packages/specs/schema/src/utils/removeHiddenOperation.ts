import {JsonMethodStore} from "../domain/JsonMethodStore";

export function removeHiddenOperation(operationStore: JsonMethodStore) {
  return !operationStore.store.get("hidden");
}
