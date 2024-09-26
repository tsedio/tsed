import {StoreSet, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import type {AsyncFormatDefinition, FormatDefinition} from "ajv";

export type FormatsOptions = Omit<FormatDefinition<any>, "validate" | "compare"> | Omit<AsyncFormatDefinition<any>, "validate" | "compare">;

/**
 * Create a new custom formats validator
 * @param name
 * @param options
 * @decorator
 * @ajv
 */
export function Formats(name: string, options: FormatsOptions = {}): ClassDecorator {
  return useDecorators(
    Injectable({
      type: "ajv:formats"
    }),
    StoreSet("ajv:formats", {
      name,
      options
    })
  );
}
