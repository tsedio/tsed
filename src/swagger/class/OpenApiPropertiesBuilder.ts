/**
 * @module swagger
 */
/** */
import {Schema} from "swagger-schema-official";
import {Type} from "../../core/interfaces/Type";
import {Store} from "../../core/class/Store";
import {PropertyRegistry} from "../../converters/registries/PropertyRegistry";
import {PropertyMetadata} from "../../converters/class/PropertyMetadata";
import {swaggerType} from "../utils/index";
import {deepExtends, nameOf} from "../../core/utils/index";
import {Storable} from "../../core/class/Storable";

/**
 * Builder a Schema from a target.
 */
export class OpenApiPropertiesBuilder {

    protected _definitions: { [definitionsName: string]: Schema } = {};
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
        const schema: Schema = Object.assign({}, store.get<Schema>("schema")) || {};

        schema.type = "object";
        schema.properties = {};

        properties.forEach((property: PropertyMetadata) => {
            const propertyKey = property.name || property.propertyKey;
            schema.properties[propertyKey] = this.createSchema(property);
        });

        this._schema = schema;

        this._definitions[nameOf(this.target)] = this.schema;

        return this;
    }

    protected createSchema(model: Storable): Schema {
        let builder;
        let schemaProperty: Schema = model.store.get<Schema>("schema") || {};

        if (model.isClass) {

            builder = new OpenApiPropertiesBuilder(model.type);
            builder.build();

            deepExtends(this._definitions, builder.definitions);
        }

        if (model.isCollection) {

            if (model.isArray) {
                schemaProperty.type = "array";

                if (model.isClass) {
                    schemaProperty.items = {
                        $ref: `#/definitions/${model.typeName}`
                    };
                } else {
                    schemaProperty.items = {
                        type: swaggerType(model.type)
                    };
                }
                return schemaProperty;
            }

            if (model.isClass) {
                schemaProperty.additionalProperties = {
                    $ref: `#/definitions/${model.typeName}`
                };
                return schemaProperty;
            }

            schemaProperty.additionalProperties = {
                type: swaggerType(model.type)
            };
            return schemaProperty;
        }

        if (model.isClass) {
            schemaProperty.$ref = `#/definitions/${model.typeName}`;
            return schemaProperty;
        }

        schemaProperty.type = swaggerType(model.type);
        return schemaProperty;
    }


    public get schema(): Schema {
        return this._schema;
    }

    public get definitions(): { [p: string]: Schema } {
        return this._definitions;
    }
}