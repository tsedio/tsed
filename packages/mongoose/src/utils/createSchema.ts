import {cleanObject, Store, Type} from "@tsed/core";
import {getProperties, JsonEntityStore} from "@tsed/schema";
import * as mongoose from "mongoose";
import {SchemaDefinition, SchemaTypeOpts} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";
import {MongooseSchemaOptions} from "../interfaces";
import {resolveRefType} from "./resolveRefType";
import {schemaOptions} from "./schemaOptions";

const MONGOOSE_RESERVED_KEYS = ["_id"];

export interface MongooseSchemaMetadata {
  schema: SchemaDefinition;
  virtuals: Map<string, any>;
}

/**
 * @ignore
 */
function setUpSchema({schema, virtuals}: MongooseSchemaMetadata, options?: mongoose.SchemaOptions) {
  const mongooseSchema = new mongoose.Schema(schema, options);

  for (const [key, options] of virtuals.entries()) {
    mongooseSchema.virtual(key, options);
  }

  return mongooseSchema;
}

/**
 * @ignore
 */
function isVirtualRef(options: SchemaTypeOpts<any>) {
  return options.ref && options.localField && options.foreignField;
}

export function createSchema(target: Type<any>, options: MongooseSchemaOptions = {}): mongoose.Schema {
  const schema = setUpSchema(buildMongooseSchema(target), options.schemaOptions);

  schemaOptions(target, options);
  schema.loadClass(target);

  return schema;
}

/**
 * Get a schema already created. If the schema doesn't exists in registry, it'll be created.
 * @param target
 * @param options
 */
export function getSchema(target: Type<any>, options: MongooseSchemaOptions = {}): mongoose.Schema {
  const store = Store.from(target);

  if (!store.has(MONGOOSE_SCHEMA)) {
    store.set(MONGOOSE_SCHEMA, createSchema(target, options));
  }

  return store.get(MONGOOSE_SCHEMA);
}

/**
 * @ignore
 */
export function buildMongooseSchema(target: any): MongooseSchemaMetadata {
  const properties = getProperties(target, {withIgnoredProps: true, mongoose: true, groups: false});
  const schema: MongooseSchemaMetadata = {schema: {}, virtuals: new Map()};

  properties.forEach((propertyMetadata, key) => {
    if (MONGOOSE_RESERVED_KEYS.includes(key as string)) {
      return;
    }

    // Keeping the Mongoose Schema separate so it can overwrite everything once schema has been built.
    const schemaTypeOptions = propertyMetadata.store.get(MONGOOSE_SCHEMA) || {};

    if (schemaTypeOptions.schemaIgnore) {
      return;
    }

    if (isVirtualRef(schemaTypeOptions)) {
      schemaTypeOptions.ref = resolveRefType(schemaTypeOptions.ref);

      schemaTypeOptions.justOne = !propertyMetadata.isArray;
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
export function createSchemaTypeOptions(propEntity: JsonEntityStore): SchemaTypeOpts<any> {
  const key = propEntity.propertyKey;
  const rawMongooseSchema = propEntity.store.get(MONGOOSE_SCHEMA) || {};

  let schemaTypeOptions: SchemaTypeOpts<any> = {
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
      match,
      min,
      max,
      minlength,
      maxlength,
      enum: jsonSchema["enum"],
      default: jsonSchema["default"]
    };
  } else if (!rawMongooseSchema.ref) {
    // References are handled by the final merge
    schemaTypeOptions = {...schemaTypeOptions, type: getSchema(propEntity.type)};
  }

  schemaTypeOptions = cleanObject({...schemaTypeOptions, ...rawMongooseSchema});

  if (propEntity.isCollection) {
    if (propEntity.isArray) {
      schemaTypeOptions = [schemaTypeOptions];
    } else {
      // Can be a Map or a Set;
      // Mongoose implements only Map;
      if (propEntity.collectionType !== Map) {
        throw new Error(`Invalid collection type. ${propEntity.collectionName} is not supported.`);
      }

      schemaTypeOptions = {type: Map, of: schemaTypeOptions};
    }
  }

  return schemaTypeOptions;
}
