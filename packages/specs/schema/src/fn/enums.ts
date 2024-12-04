import {enumsRegistry} from "../registries/enumRegistries.js";
import {string} from "./string.js";

export function enums(e: Record<string, any>) {
  const schema = string().enum(e);
  enumsRegistry.set(e, schema);

  return schema;
}
