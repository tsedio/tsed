import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Create a new custom formats validator
 * @param name
 * @param options
 * @decorator
 * @ajv
 */
export function ErrorMsg(obj: Record<string, string>) {
  return JsonEntityFn((store) => {
    // since errorMessage is a custom key, it is prefixed with a # to avoid conflict with JSON Schema keywords
    const errorMessage = store.parentSchema.get("#errorMessage") || {};
    store.parentSchema.customKey("errorMessage", {...errorMessage, ...obj});
  });
}
