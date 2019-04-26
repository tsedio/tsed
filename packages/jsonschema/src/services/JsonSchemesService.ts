import {JSONSchema6} from "json-schema";
import {ProxyRegistry, Type} from "@tsed/core";
import {Service} from "@tsed/di";
import {JsonSchema} from "../class/JsonSchema";
import {JsonSchemesRegistry} from "../registries/JsonSchemesRegistry";

@Service()
export class JsonSchemesService extends ProxyRegistry<any, JsonSchema> {
  private cache: Map<Type<any>, JSONSchema6> = new Map();

  constructor() {
    super(JsonSchemesRegistry);
  }

  /**
   *
   * @param {Type<any>} target
   * @returns {JSONSchema4}
   */
  getSchemaDefinition(target: Type<any>): JSONSchema6 | undefined {
    if (!this.cache.has(target)) {
      this.cache.set(target, JsonSchemesRegistry.getSchemaDefinition(target));
    }

    return this.cache.get(target);
  }
}
