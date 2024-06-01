import {isEsm} from "./sourceType.js";

export function resolveExtension(moduleSpecifier: string) {
  if (isEsm() && moduleSpecifier.match(/\.\/.*/) && !moduleSpecifier.endsWith(".js")) {
    return `${moduleSpecifier}.js`;
  }

  return moduleSpecifier;
}
