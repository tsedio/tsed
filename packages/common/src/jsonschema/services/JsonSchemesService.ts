import {ProxyRegistry, Type} from "@tsed/core";
import {Service} from "@tsed/di";
import {JSONSchema6} from "json-schema";
import {JsonSchema} from "../class/JsonSchema";
import {JsonSchemesRegistry} from "../registries/JsonSchemesRegistry";
import {getJsonSchema} from "../utils/getJsonSchema";

/**
 * @deprecated use getJsonSchema instead
 */
@Service()
export class JsonSchemesService extends ProxyRegistry<any, JsonSchema> {
  constructor() {
    super(JsonSchemesRegistry);
  }

  /**
   *
   * @param {Type<any>} target
   * @returns {JSONSchema4}
   * @deprecated use getJsonSchema instead
   */
  getSchemaDefinition(target: Type<any>): JSONSchema6 | undefined {
    return getJsonSchema(target);
  }
}
