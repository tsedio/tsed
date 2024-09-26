import {StoreSet, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import type {JsonSchema} from "@tsed/schema";
import type {AnySchemaObject, KeywordDefinition} from "ajv";

export type KeywordOptions = Partial<Omit<KeywordDefinition, "metaSchema">> & {
  metaSchema?: AnySchemaObject | JsonSchema;
};

/**
 * Create new keyword custom validator
 * @param options
 * @decorator
 * @ajv
 */
export function Keyword(options: KeywordOptions): ClassDecorator {
  return useDecorators(
    Injectable({
      type: "ajv:keyword"
    }),
    StoreSet("ajv:keyword", {
      ...options,
      metaSchema: options.metaSchema && options.metaSchema.toJSON ? options.metaSchema.toJSON() : options.metaSchema
    })
  );
}
