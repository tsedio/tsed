import {JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";
import {Type} from "@tsed/core";
/**
 * @ignore
 */
/**
 * A map that counts its changes, so the serializers resync their type mappers only when the registry changed.
 *
 * @ignore
 */
export class JsonMapperTypesMap<K = Type<any> | Symbol | string, V = JsonMapperMethods> extends Map<K, V> {
  version = 0;

  set(key: K, value: V) {
    this.version++;
    return super.set(key, value);
  }

  delete(key: K) {
    const deleted = super.delete(key);

    if (deleted) {
      this.version++;
    }

    return deleted;
  }

  clear() {
    this.version++;
    super.clear();
  }
}

/**
 * @ignore
 */
// tslint:disable-next-line:variable-name
const JsonMapperTypesContainer: Map<Type<any> | Symbol | string, JsonMapperMethods> = new JsonMapperTypesMap();
/**
 * Register a mapper class for a specific primitive/complex type so it can be reused by the serializers.
 */
export function registerJsonTypeMapper(type: Type<any> | Symbol | string, token: Type<JsonMapperMethods>) {
  JsonMapperTypesContainer.set(type, new token());
}

/**
 * Retrieve the registry of custom JSON mapper instances keyed by the types they support.
 */
export function getJsonMapperTypes(): Map<Type<any> | Symbol | string, JsonMapperMethods> {
  return JsonMapperTypesContainer;
}
