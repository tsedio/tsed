import {type KeywordOptions, keyword} from "../fn/keyword.js";

/**
 * Create new keyword custom validator
 * @param options
 * @decorator
 * @ajv
 */
export function Keyword(options: KeywordOptions): ClassDecorator {
  return (target) => {
    keyword(target, options);
  };
}
