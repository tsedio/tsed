import {getJsonEntityStore, getJsonMethodStore, JsonEntityStore} from "./domain/index.js";

declare module "@tsed/schema" {
  export namespace JsonEntityStore {
    /**
     * @deprecated
     */
    const from: typeof getJsonEntityStore;
    /**
     * @deprecated
     */
    const fromMethod: typeof getJsonMethodStore;
  }
}

const CompatJsonEntityStore = JsonEntityStore as typeof JsonEntityStore & {
  /**
   * @deprecated
   */
  from: typeof getJsonEntityStore;
  /**
   * @deprecated
   */
  fromMethod: typeof getJsonMethodStore;
};

CompatJsonEntityStore.from = getJsonEntityStore;
CompatJsonEntityStore.fromMethod = getJsonMethodStore;
