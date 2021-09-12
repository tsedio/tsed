import {Store} from "@tsed/core";
import {MONGOOSE_SCHEMA_OPTIONS} from "../constants";

export function DiscriminatorKey(): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    Store.from(target).merge(MONGOOSE_SCHEMA_OPTIONS, {discriminatorKey: propertyKey});
  };
}
