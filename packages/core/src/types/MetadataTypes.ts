import type {Type} from "./Type.js";

export interface MetadataTypes<T = any, C = any> {
  type?: Type<T> | T;
  collectionType?: Type<C> | C;
}
