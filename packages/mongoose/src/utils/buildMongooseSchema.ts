import {Store} from "@tsed/core";
import {JsonSchemesRegistry, PropertyRegistry} from "@tsed/common";
import {MONGOOSE_SCHEMA} from "../constants";
import {MongooseSchema} from "../interfaces";

const MONGOOSE_RESERVED_KEYS = ["_id"];

const clean = (src: any) =>
  Object.keys(src).reduce((obj: any, k: any) => {
    if (src[k] !== undefined) {
      obj[k] = src[k];
    }

    return obj;
  }, {});

export function mapProps(jsonProps: any = {}) {
  const {minimum, maximum, minLength, maxLength} = jsonProps;
  let {pattern} = jsonProps;
  const enumProp = jsonProps["enum"];
  const defaultProp = jsonProps["default"];

  if (pattern) {
    pattern = new RegExp(pattern);
  }

  return clean({
    match: pattern,
    min: minimum,
    max: maximum,
    minlength: minLength,
    maxlength: maxLength,
    enum: enumProp,
    default: defaultProp
  });
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
    const jsonSchema: any = JsonSchemesRegistry.getSchemaDefinition(target) || {properties: {}};

    for (const [key, metadata] of properties.entries()) {
      if (MONGOOSE_RESERVED_KEYS.includes(key as string)) {
        continue;
      }

      // Keeping the Mongoose Schema separate so it can overwrite everything once schema has been built.
      const mongooseSchema = metadata.store.get(MONGOOSE_SCHEMA) || {};

      if (mongooseSchema.ref && mongooseSchema.localField && mongooseSchema.foreignField) {
        mongooseSchema.justOnce = !metadata.isArray;
        schema.virtuals.set(key as string, mongooseSchema);
        continue;
      }

      let definition: any = {
        required: metadata.required
          ? function() {
              return metadata.isRequired(this[key]);
            }
          : false
      };

      if (!metadata.isClass) {
        definition = Object.assign(definition, {type: metadata.type}, mapProps(jsonSchema.properties[key]));
      } else if (!mongooseSchema.ref) {
        // References are handled by the final merge
        definition = Object.assign(definition, {type: Store.from(metadata.type).get(MONGOOSE_SCHEMA)});
      }

      definition = clean(Object.assign(definition, mongooseSchema));

      if (metadata.isCollection) {
        if (metadata.isArray) {
          definition = [definition];
        } else {
          // Can be a Map or a Set;
          // Mongoose implements only Map;
          if (metadata.collectionType !== Map) {
            throw new Error(`Invalid collection type. ${metadata.collectionName} is not supported.`);
          }

          definition = {type: Map, of: definition};
        }
      }

      schema.schema[key as string] = definition;
    }
  }

  return schema;
}
