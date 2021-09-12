import {getValue} from "@tsed/core";

export function getPath(error: any) {
  return getValue(error, "dataPath", getValue(error, "instancePath", "")).replace(/\//gi, ".");
}
