import {type FormatsOptions, formats} from "../fn/formats.js";

/**
 * Create a new custom formats validator
 * @param name
 * @param options
 * @decorator
 * @ajv
 */
export function Formats(name: string, options: FormatsOptions = {}): ClassDecorator {
  return (target) => {
    formats(target, name, options);
  };
}
