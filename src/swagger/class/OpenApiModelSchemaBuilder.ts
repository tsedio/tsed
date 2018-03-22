import {JsonSchema, JsonSchemesRegistry, PropertyMetadata, PropertyRegistry} from "@tsed/common";
import {deepExtends, nameOf, Storable, Store, Type} from "@tsed/core";
import {Schema} from "swagger-schema-official";
import {OpenApiDefinitions} from "../interfaces/OpenApiDefinitions";
import {OpenApiResponses} from "../interfaces/OpenApiResponses";
import {swaggerType} from "../utils";

/**
 * Build a Schema from a given Model.
 */
export class OpenApiModelSchemaBuilder {

    protected _definitions: OpenApiDefinitions = {};
    protected _responses: OpenApiResponses = {};
    protected _schema: Schema;

    constructor(private target: Type<any>) {

    }

    /**
     * Build the Schema and his properties.
     * @returns {OpenApiModelSchemaBuilder}
     */
    build(): this {

        const properties = PropertyRegistry.getProperties(this.target);
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
            schema.properties![propertyKey] = this.createSchema(property);
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
    protected createSchema(model: Storable): Schema {
        let builder;
        let schema: any = model.store.get<Schema>("schema") || {};

        if (schema instanceof JsonSchema) {
            schema = schema.toObject();
        }

        if (model.isClass) {

            builder = new OpenApiModelSchemaBuilder(model.type);
            builder.build();

            deepExtends(this._definitions, builder.definitions);
        }

        if (model.isCollection) {

            if (model.isArray) {
                schema.type = "array";

                // Nobody have defined the items so far.
                if (!schema.items) {
                    if (model.isClass) {
                        schema.items = {
                            $ref: `#/definitions/${model.typeName}`
                        };
                    } else {
                        schema.items = {
                            type: schema.items && schema.items.type || swaggerType(model.type)
                        };
                    }
                }
                return schema;
            }

            if (model.isClass) {
                schema.additionalProperties = {
                    $ref: `#/definitions/${model.typeName}`
                };
                return schema;
            }

            schema.additionalProperties = {
                type: schema.additionalProperties && schema.additionalProperties.type || swaggerType(model.type)
            };
            return schema;
        }

        if (model.isClass) {
            schema.$ref = `#/definitions/${model.typeName}`;
            delete schema.type;
            return schema;
        }

        schema.type = schema.type || swaggerType(model.type);
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

    public get schema(): Schema {
        return this._schema;
    }

    public get definitions(): OpenApiDefinitions {
        return this._definitions;
    }

    public get responses(): OpenApiResponses {
        return this._responses;
    }
}

/**
 * @deprecated
 */
export class OpenApiPropertiesBuilder extends OpenApiModelSchemaBuilder {
}