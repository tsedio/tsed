import type {JsonMethodStore} from "../components/stores/JsonMethodStore.js";

export function removeHiddenOperation(operationStore: JsonMethodStore) {
  return !operationStore.store.get("hidden");
}
