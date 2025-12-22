import {injectable, type TokenProvider} from "@tsed/di";
import {AsyncFormatDefinition, FormatDefinition} from "ajv";

export type FormatsOptions = Omit<FormatDefinition<any>, "validate" | "compare"> | Omit<AsyncFormatDefinition<any>, "validate" | "compare">;

/**
 * Create a new custom formats validator
 * @param token
 * @param name
 * @param options
 * @ajv
 */
export function formats<Token extends TokenProvider>(token: Token, name: string, options: FormatsOptions = {}) {
  return injectable<Token>(token, {type: "ajv:formats"}).set("ajv:formats", {
    name,
    options
  });
}
