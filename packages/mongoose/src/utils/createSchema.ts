import {ConverterService, IConverterOptions, JsonSchema, PropertyMetadata, PropertyRegistry} from "@tsed/common";
import {getClass, Store, Type} from "@tsed/core";
import * as mongoose from "mongoose";
import {SchemaTypeOpts} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";
import {MongooseSchema, MongooseSchemaOptions} from "../interfaces";
import {cleanProps} from "./cleanProps";
import {applySchemaOptions} from "./schemaOptions";

const MONGOOSE_RESERVED_KEYS = ["_id"];

function setUpTarget(target: Type<any>) {
  target.prototype.serialize = function(options: IConverterOptions, converter: ConverterService) {
    const {checkRequiredValue, ignoreCallback} = options;

    return converter.serializeClass(this, {
      type: getClass(target),
      checkRequiredValue,
      ignoreCallback
    });
  };
}

function setUpSchema({schema, virtuals}: MongooseSchema, options?: mongoose.SchemaOptions) {
  const mongooseSchema = new mongoose.Schema(schema, options);

  for (const [key, options] of virtuals.entries()) {
    mongooseSchema.virtual(key, options);
  }

  return mongooseSchema;
}

function isVirtualRef(options: SchemaTypeOpts<any>) {
  return options.ref && options.localField && options.foreignField;
}

export function createSchema(target: Type<any>, options: MongooseSchemaOptions = {}): mongoose.Schema {
  const schema = setUpSchema(buildMongooseSchema(target), options.schemaOptions);

  applySchemaOptions(target, options);
  setUpTarget(target);
  schema.loadClass(target);

  return schema;
}

export function getSchema(target: Type<any>, options: MongooseSchemaOptions = {}): mongoose.Schema {
  const store = Store.from(target);

  if (!store.has(MONGOOSE_SCHEMA)) {
    store.set(MONGOOSE_SCHEMA, createSchema(target, options));
  }

  return store.get(MONGOOSE_SCHEMA);
}

/**
 *
 * @param target
 * @returns {MongooseSchema}
 */
export function buildMongooseSchema(target: any): MongooseSchema {
  const properties = PropertyRegistry.getProperties(target);
  const schema: MongooseSchema = {schema: {}, virtuals: new Map()};

  if (properties) {
    const properties = PropertyRegistry.getProperties(target);

    properties.forEach((propertyMetadata, key) => {
      if (MONGOOSE_RESERVED_KEYS.includes(key as string)) {
        return;
      }

      // Keeping the Mongoose Schema separate so it can overwrite everything once schema has been built.
      const schemaTypeOptions = propertyMetadata.store.get(MONGOOSE_SCHEMA) || {};

      if (isVirtualRef(schemaTypeOptions)) {
        schemaTypeOptions.justOne = !propertyMetadata.isArray;
        schema.virtuals.set(key as string, schemaTypeOptions);

        return;
      }

      schema.schema[key as string] = createSchemaTypeOptions(propertyMetadata);
    });
  }

  return schema;
}

export function createSchemaTypeOptions(propertyMetadata: PropertyMetadata): SchemaTypeOpts<any> {
  const key = propertyMetadata.propertyKey;
  const rawMongooseSchema = propertyMetadata.store.get(MONGOOSE_SCHEMA) || {};

  let schemaTypeOptions: SchemaTypeOpts<any> = {
    required: propertyMetadata.required
      ? function() {
          return propertyMetadata.isRequired(this[key]);
        }
      : false
  };

  if (!propertyMetadata.isClass) {
    const jsonSchema: JsonSchema = propertyMetadata.store.get("schema") || {};
    const {minimum: min, maximum: max, minLength: minlength, maxLength: maxlength} = jsonSchema;

    let match: string | RegExp = jsonSchema.pattern;
    if (match) {
      match = new RegExp(match);
    }

    schemaTypeOptions = {
      ...schemaTypeOptions,
      type: propertyMetadata.type,
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
    schemaTypeOptions = {...schemaTypeOptions, type: getSchema(propertyMetadata.type)};
  }

  schemaTypeOptions = cleanProps({...schemaTypeOptions, ...rawMongooseSchema});

  if (propertyMetadata.isCollection) {
    if (propertyMetadata.isArray) {
      schemaTypeOptions = [schemaTypeOptions];
    } else {
      // Can be a Map or a Set;
      // Mongoose implements only Map;
      if (propertyMetadata.collectionType !== Map) {
        throw new Error(`Invalid collection type. ${propertyMetadata.collectionName} is not supported.`);
      }

      schemaTypeOptions = {type: Map, of: schemaTypeOptions};
    }
  }

  return schemaTypeOptions;
}
