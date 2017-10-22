/**
 * @module swagger
 */
/** */
import {Response, Schema} from "swagger-schema-official";
import {Storable} from "../../core/class/Storable";
import {Store} from "../../core/class/Store";
import {Type} from "../../core/interfaces";
import {deepExtends, nameOf} from "../../core/utils";
import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";
import {swaggerType} from "../utils";

/**
 * Builder a Schema from a target.
 */
export class OpenApiPropertiesBuilder {

    protected _definitions: { [definitionsName: string]: Schema } = {};
    protected _responses: { [responseName: string]: Response } = {};
    protected _schema: Schema;

    constructor(private target: Type<any>) {

    }

    /**
     *
     * @returns {OpenApiSchemaBuilder}
     */
    build(): this {

        const properties = PropertyRegistry.getProperties(this.target);
        const store = Store.from(this.target);
        const schema: Schema = this.getJsonSchema() || {};

        if (store.get("description")) {
            schema.description = schema.description || store.get("description");
        }

        if (schema.required && schema.required.length) {
            this._responses[400] = {description: "Missing required parameter"};
        }

        schema.type = "object";
        schema.properties = {};

        properties.forEach((property: PropertyMetadata) => {
            const propertyKey = property.name || property.propertyKey;
            schema.properties![propertyKey] = this.createSchema(property);
        });

        this._schema = schema;
        this._definitions[nameOf(this.target)] = this.schema;

        return this;
    }

    protected createSchema(model: Storable): Schema {
        let builder;
        let schema: Schema = model.store.get<Schema>("schema") || {};

        if (model.store.get("description")) {
            schema.description = schema.description || model.store.get("description");
        }

        if (model.isClass) {

            builder = new OpenApiPropertiesBuilder(model.type);
            builder.build();

            deepExtends(this._definitions, builder.definitions);
        }

        if (model.isCollection) {

            if (model.isArray) {
                schema.type = "array";

                if (model.isClass) {
                    schema.items = {
                        $ref: `#/definitions/${model.typeName}`
                    };
                } else {
                    schema.items = {
                        type: swaggerType(model.type)
                    };
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
                type: swaggerType(model.type)
            };
            return schema;
        }

        if (model.isClass) {
            schema.$ref = `#/definitions/${model.typeName}`;
            return schema;
        }

        schema.type = swaggerType(model.type);
        return schema;
    }

    public getJsonSchema() {
        const schema = Store.from(this.target).get<Schema>("schema");
        return schema.toJSON ? schema.toJSON() : schema;
    }

    public get schema(): Schema {
        return this._schema;
    }

    public get definitions(): { [p: string]: Schema } {
        return this._definitions;
    }

    public get responses(): { [responseName: string]: Response } {
        return this._responses;
    }
}