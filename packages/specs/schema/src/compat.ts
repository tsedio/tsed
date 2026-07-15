import {getJsonEntityStore, getJsonMethodStore, JsonEntityStore, JsonMethodStore} from "./domain/index.js";

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
    /**
     * @deprecated use s.store
     */
    const get: typeof getJsonEntityStore;
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
  /**
   * @deprecated
   */
  get: typeof getJsonEntityStore;
};

CompatJsonEntityStore.get = getJsonEntityStore;
CompatJsonEntityStore.from = getJsonEntityStore;
CompatJsonEntityStore.fromMethod = getJsonMethodStore;
(JsonMethodStore as any).get = getJsonMethodStore;
