import {JsonSchema, JsonSchemesRegistry, PropertyMetadata} from "@tsed/common";
import {isArrayOrArrayClass, isClass, isCollection, isObject, nameOf, Storable, Store, Type} from "@tsed/core";
import {Schema} from "swagger-schema-official";
import {OpenApiDefinitions} from "../interfaces/OpenApiDefinitions";
import {OpenApiResponses} from "../interfaces/OpenApiResponses";
import {swaggerApplyType} from "../utils";

/**
 * Build a Schema from a given Model.
 */
export class OpenApiModelSchemaBuilder {
  protected _definitions: OpenApiDefinitions = {};
  protected _responses: OpenApiResponses = {};
  protected _schema: Schema;

  constructor(private target: Type<any>) {
  }

  public get schema(): Schema {
    return this._schema;
  }

  public get definitions(): OpenApiDefinitions {
    return this._definitions;
  }

  public get responses(): OpenApiResponses {
    return this._responses;
  }

  /**
   * Build the Schema and his properties.
   * @returns {OpenApiModelSchemaBuilder}
   */
  build(): this {
    const properties = PropertyMetadata.getProperties(this.target);
    const store = Store.from(this.target);
    const schema: Schema = this.getClassSchema();
    schema.type = "object";
    schema.properties = {};

    if (store.get("description")) {
      schema.description = schema.description || store.get("description");
    }

    if (schema.required && schema.required.length) {
      this._responses[400] = {description: "Missing required parameter"};
    }

    properties.forEach((property: PropertyMetadata) => {
      const propertyKey = property.name || property.propertyKey;
      schema.properties![String(propertyKey)] = this.createSchema({
        schema: property.store.get("schema"),
        type: property.type,
        collectionType: property.collectionType
      });
    });

    this._schema = schema;
    this._definitions[nameOf(this.target)] = this.schema;

    return this;
  }

  /**
   *
   * @param {Storable} model
   * @returns {Schema}
   */
  protected createSchema({
                           schema = {},
                           type,
                           collectionType
                         }: {
    schema: Partial<Schema>;
    type: Type<any>;
    collectionType: Type<any> | undefined;
  }): Schema {
    let builder;
    const typeName = nameOf(type);

    if (schema instanceof JsonSchema) {
      schema = schema.toObject();
    }

    if (isClass(type)) {
      builder = new OpenApiModelSchemaBuilder(type);
      builder.build();

      this._definitions = {
        ...this._definitions,
        ...builder.definitions
      };
    }

    if (isCollection(collectionType)) {
      if (isArrayOrArrayClass(collectionType)) {
        schema.type = "array";

        if (!schema.items) {
          if (isClass(type)) {
            schema.items = {
              $ref: `#/definitions/${typeName}`
            };
          } else {
            schema.items = swaggerApplyType({}, (isObject(schema.additionalProperties) && schema.additionalProperties.type) || type);
          }
        }

        return schema;
      }

      schema.type = schema.type || "object";

      if (isClass(type)) {
        schema.additionalProperties = {
          $ref: `#/definitions/${typeName}`
        };

        return schema;
      }

      schema.additionalProperties = swaggerApplyType(
        {},
        (isObject(schema.additionalProperties) && schema.additionalProperties.type) || type
      );

      return schema;
    }

    if (isClass(type)) {
      schema.$ref = `#/definitions/${typeName}`;
      delete schema.type;

      return schema;
    }

    schema = swaggerApplyType(schema, schema.type || type);

    return schema;
  }

  /**
   * Return the stored Schema of the class if exists. Otherwise, return an empty Schema.
   * @returns {any}
   */
  protected getClassSchema(): Schema {
    const schema = JsonSchemesRegistry.getSchemaDefinition(this.target) || {};
    delete schema.definitions;

    return schema as Schema;
  }
}

/**
 * @deprecated
 */
export class OpenApiPropertiesBuilder extends OpenApiModelSchemaBuilder {
}
