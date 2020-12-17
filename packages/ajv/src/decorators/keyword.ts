import {StoreSet, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {KeywordDefinition} from "ajv";

/**
 * Create new keyword custom validator
 * @param options
 * @decorator
 */
export function Keyword(options: Partial<KeywordDefinition>): ClassDecorator {
  return useDecorators(
    Injectable({
      type: "ajv:keyword"
    }),
    StoreSet("ajv:keyword", options)
  );
}
