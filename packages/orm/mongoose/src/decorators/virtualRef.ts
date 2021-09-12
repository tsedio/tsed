import {isPlainObject, isString, Store, StoreMerge, useDecorators} from "@tsed/core";
import {CollectionOf, Property} from "@tsed/schema";
import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../constants";
import {MongooseVirtualRefOptions} from "../interfaces/MongooseVirtualRefOptions";

function getRef(opts: any) {
  const ref = opts.ref || opts.type;

  return isString(ref) ? ref : Store.from(ref).get(MONGOOSE_MODEL_NAME);
}

function getType(opts: any) {
  const ref = opts.ref || opts.type;

  return !isString(ref) ? ref : Object;
}

function getInitialOpts(options: string | MongooseVirtualRefOptions, foreignField?: string): any {
  return isPlainObject(options) ? options : {type: options as any, foreignField};
}

function mapToSchema(opts: any) {
  const ref = getRef(opts);

  const schema: any = {
    ref,
    localField: opts.localField || "_id",
    foreignField: opts.foreignField,
    justOne: opts.justOne || false,
    options: opts.options
  };

  return schema;
}

/**
 * Define a property as mongoose virtual reference to other Model (decorated with @Model).
 *
 * ::: warning
 * To avoid circular dependencies, do not use the virtual reference model in
 * anything except a type declaration. Using the virtual reference model will prevent
 * typescript transpiler from stripping away the import statement and cause a circular
 * import in node.
 * :::
 *
 * ### Example
 *
 * <<< @/tutorials/snippets/mongoose/virtual-references.ts
 *
 * @param type
 * @param foreignField
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function VirtualRef(type: string, foreignField: string): Function;
export function VirtualRef(options: MongooseVirtualRefOptions): Function;
export function VirtualRef(options: string | MongooseVirtualRefOptions, foreignField?: string): Function;
export function VirtualRef(options: string | MongooseVirtualRefOptions, foreignField?: string): Function {
  const opts = getInitialOpts(options, foreignField);
  const schema = mapToSchema(opts);
  const type = getType(opts);

  return useDecorators(StoreMerge(MONGOOSE_SCHEMA, schema), type && (schema.justOne ? Property(type) : CollectionOf(type)));
}

export type VirtualRef<T> = T | null;
export type VirtualRefs<T> = T[];
