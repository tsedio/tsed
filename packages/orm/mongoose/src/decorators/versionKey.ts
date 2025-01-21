import {Store} from "@tsed/core";

import {MONGOOSE_SCHEMA_OPTIONS} from "../constants/constants.js";

export function VersionKey(): PropertyDecorator {
  return (target, propertyKey) => {
    Store.from(target).merge(MONGOOSE_SCHEMA_OPTIONS, {versionKey: propertyKey});
  };
}
