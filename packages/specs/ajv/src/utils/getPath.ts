import {getValue} from "@tsed/core";

export function getPath(error: any) {
  if (error.params && error.params.missingProperty) {
    return `.${error.params.missingProperty}`;
  }

  return getInstancePath(error);
}

export function getInstancePath(error: any) {
  return getValue(error, "dataPath", getValue(error, "instancePath", "")).replace(/\//gi, ".");
}
