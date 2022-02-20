import {Store, useDecorators} from "@tsed/core";
import {MONGOOSE_SCHEMA_OPTIONS} from "../constants/constants";
import {SchemaIgnore} from "./schemaIgnore";
import {Property} from "@tsed/schema";

export function DiscriminatorKey(): PropertyDecorator {
  return useDecorators(Property(), SchemaIgnore(), (target: any, propertyKey: string) => {
    Store.from(target).merge(MONGOOSE_SCHEMA_OPTIONS, {discriminatorKey: propertyKey});
  });
}
