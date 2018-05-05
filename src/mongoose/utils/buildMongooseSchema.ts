import {JsonSchemesRegistry, PropertyMetadata, PropertyRegistry} from "@tsed/common";
import * as mongoose from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";

const MONGOOSE_RESERVED_KEYS = ["_id"];

const clean = (src: any) => Object
    .keys(src)
    .reduce((obj: any, k: any) => {
        if (src[k] !== undefined) {
            obj[k] = src[k];
        }

        return obj;
    }, {});

export function mapProps(jsonProps: any = {}) {
    const { minimum, maximum, minLength, maxLength} = jsonProps;
    let { pattern } = jsonProps;
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
        "enum": enumProp,
        "default": defaultProp
    });
}

/**
 *
 * @param target
 * @returns {"mongoose".SchemaDefinition}
 */
export function buildMongooseSchema(target: any): mongoose.SchemaDefinition {
    const properties = PropertyRegistry.getProperties(target);
    const jsonSchema: any = JsonSchemesRegistry.getSchemaDefinition(target) || {};
    const mSchema: mongoose.SchemaDefinition = {};

    if (properties) {
        properties.forEach((propertyMetadata: PropertyMetadata, propertyKey: string) => {

            if (MONGOOSE_RESERVED_KEYS.indexOf(propertyKey) > -1) {
                return;
            }

            let definition = {
                required: propertyMetadata.required
                    ? function () {
                        return propertyMetadata.isRequired(this[propertyKey]);
                    }
                    : false
            };

            if (propertyMetadata.isClass) {
                definition = Object.assign(definition, buildMongooseSchema(propertyMetadata.type));
            } else {
                definition = Object.assign(
                    definition,
                    {type: propertyMetadata.type},
                    mapProps((jsonSchema.properties || {})[propertyKey])
                );
            }

            definition = clean(Object.assign(definition, propertyMetadata.store.get(MONGOOSE_SCHEMA) || {}));

            mSchema[propertyKey] = propertyMetadata.isArray ? [definition] : definition;
        });
    }

    return mSchema;
}
