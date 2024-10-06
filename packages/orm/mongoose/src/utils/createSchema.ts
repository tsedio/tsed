import {cleanObject, nameOf, Store, Type} from "@tsed/core";
import {deserialize, serialize} from "@tsed/json-mapper";
import {getProperties, JsonEntityStore} from "@tsed/schema";
import {pascalCase} from "change-case";
import mongoose, {Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions} from "mongoose";

import {MONGOOSE_SCHEMA, MONGOOSE_SCHEMA_OPTIONS} from "../constants/constants.js";
import {MongooseSchemaOptions} from "../interfaces/MongooseSchemaOptions.js";
import {MongooseVirtualRefOptions} from "../interfaces/MongooseVirtualRefOptions.js";
import {resolveRefType} from "./resolveRefType.js";
import {schemaOptions} from "./schemaOptions.js";

export interface MongooseSchemaMetadata {
  schema: SchemaDefinition;
  virtuals: Map<string, MongooseVirtualRefOptions>;
}

/**
 * @ignore
 */
function setUpSchema({schema, virtuals}: MongooseSchemaMetadata, options?: SchemaOptions) {
  const mongooseSchema = new mongoose.Schema(schema, options as never);

  for (const [key, options] of virtuals.entries()) {
    mongooseSchema.virtual(key, options);
  }

  return mongooseSchema;
}

/**
 * @ignore
 */
function isVirtualRef(target: Partial<MongooseVirtualRefOptions>): target is MongooseVirtualRefOptions {
  return !!(target.ref && target.localField && target.foreignField);
}

function hasVersionField(schema: mongoose.Schema, versionKey?: string | boolean) {
  // Check if versioning was disabled explicitly
  if (!versionKey) return false;

  // Check for alternative version field in schema
  return (versionKey as string) in schema.paths;
}

export function createSchema(target: Type<any>, options: MongooseSchemaOptions = {}): mongoose.Schema {
  const entity = JsonEntityStore.from(target);
  const schemaOptionsFromStore = entity.store.get(MONGOOSE_SCHEMA_OPTIONS) || {};
  options.schemaOptions = {...options.schemaOptions, ...schemaOptionsFromStore};

  if (entity.schema.isDiscriminator) {
    options.schemaOptions!.discriminatorKey = entity.schema.discriminator().propertyName;
  }

  const schema = setUpSchema(buildMongooseSchema(target), options.schemaOptions);

  schemaOptions(target, options);

  const outputVersionKey = hasVersionField(schema, options.schemaOptions?.versionKey);

  schema.methods.toClass = function toClass() {
    return deserialize(
      this.toObject({
        virtuals: true,
        versionKey: outputVersionKey,
        flattenMaps: true
      }),
      {
        type: target,
        useAlias: false,
        additionalProperties: true,
        disabledUnsecureConstructor: false,
        groups: false
      }
    );
  };

  schema.methods.toJSON = function toJSON(options?: any) {
    return serialize((this as any).toClass(), options);
  };

  schema.loadClass(target);

  Store.from(target).set(MONGOOSE_SCHEMA, schema);

  return schema;
}

/**
 * Get a schema already created. If the schema doesn't exists in registry, it'll be created.
 * @param target
 * @param options
 */
export function getSchema(target: Type<any>, options: MongooseSchemaOptions = {}): Schema {
  const store = Store.from(target);

  if (!store.has(MONGOOSE_SCHEMA)) {
    createSchema(target, options);
  }

  return store.get(MONGOOSE_SCHEMA);
}

export function getSchemaToken(target: Type<any>, options?: any) {
  const collectionName = options.name || nameOf(target);
  const token = Symbol.for(pascalCase(`${collectionName}Schema`));

  return {token, collectionName};
}

/**
 * @ignore
 */
export function buildMongooseSchema(target: any): MongooseSchemaMetadata {
  const properties = getProperties(target, {withIgnoredProps: true, mongoose: true, groups: false});
  const schema: MongooseSchemaMetadata = {schema: {}, virtuals: new Map()};

  properties.forEach((propertyMetadata, key) => {
    // Keeping the Mongoose Schema separate, so it can overwrite everything once schema has been built.
    const schemaTypeOptions: any = propertyMetadata.store.get(MONGOOSE_SCHEMA) || {};

    if (schemaTypeOptions.schemaIgnore || propertyMetadata.isDiscriminatorKey() || propertyMetadata.isGetterOnly()) {
      return;
    }

    if (schemaTypeOptions.ref) {
      schemaTypeOptions.ref = resolveRefType(schemaTypeOptions.ref as any);
    }

    if (isVirtualRef(schemaTypeOptions)) {
      schema.virtuals.set(key as string, schemaTypeOptions);

      return;
    }

    schema.schema[key as string] = createSchemaTypeOptions(propertyMetadata);
  });

  return schema;
}

/**
 * @ignore
 */
export function createSchemaTypeOptions<T = any>(propEntity: JsonEntityStore): SchemaTypeOptions<T> | SchemaTypeOptions<T>[] {
  const key = propEntity.propertyKey;
  const rawMongooseSchema = propEntity.store.get(MONGOOSE_SCHEMA) || {};

  let schemaTypeOptions: SchemaTypeOptions<T> = {
    required: propEntity.required
      ? function () {
          return propEntity.isRequired(this[key]);
        }
      : false
  };

  if (!propEntity.isClass) {
    const jsonSchema = propEntity.itemSchema.toJSON();
    const {minimum: min, maximum: max, minLength: minlength, maxLength: maxlength} = jsonSchema;

    let match: string | RegExp = jsonSchema.pattern;
    if (match) {
      match = new RegExp(match);
    }

    schemaTypeOptions = {
      ...schemaTypeOptions,
      type: propEntity.type,
      match: match as RegExp,
      min,
      max,
      minlength,
      maxlength,
      enum: /*jsonSchema["enum"] instanceof JsonSchema ? jsonSchema["enum"].toJSON().enum :*/ jsonSchema["enum"],
      default: jsonSchema["default"]
    };
  } else if (!rawMongooseSchema.ref) {
    // References are handled by the final merge
    schemaTypeOptions = {...schemaTypeOptions, type: getSchema(propEntity.type) as any};
  }

  schemaTypeOptions = cleanObject({...schemaTypeOptions, ...rawMongooseSchema});

  if (propEntity.isCollection) {
    if (propEntity.isArray) {
      return [schemaTypeOptions];
    }
    // Can be a Map or a Set;
    // Mongoose implements only Map;
    if (propEntity.collectionType !== Map) {
      throw new Error(`Invalid collection type. ${nameOf(propEntity.collectionType)} is not supported.`);
    }

    return {type: Map, of: schemaTypeOptions} as unknown as SchemaTypeOptions<T>;
  }

  return schemaTypeOptions;
}
