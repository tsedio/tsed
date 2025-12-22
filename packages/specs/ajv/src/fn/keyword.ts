import {injectable, type TokenProvider} from "@tsed/di";
import {JsonSchema} from "@tsed/schema";
import type {AnySchemaObject, KeywordDefinition} from "ajv";

export type KeywordOptions = Partial<Omit<KeywordDefinition, "metaSchema">> & {
  metaSchema?: AnySchemaObject | JsonSchema;
};

/**
 * Create a new keyword custom validator
 * @param token
 * @param options
 * @decorator
 * @ajv
 */
export function keyword<Token extends TokenProvider>(token: Token, options: KeywordOptions) {
  return injectable<Token>(token)
    .type("ajv:keyword")
    .set("ajv:keyword", {
      ...options,
      metaSchema: options.metaSchema && options.metaSchema.toJSON ? options.metaSchema.toJSON() : options.metaSchema
    });
}
