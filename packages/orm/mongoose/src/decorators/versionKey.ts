import {MONGOOSE_SCHEMA_OPTIONS} from "../constants/constants.js";
import {Store} from "@tsed/core";

export function VersionKey(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    Store.from(target).merge(MONGOOSE_SCHEMA_OPTIONS, {versionKey: propertyKey});
  };
}
