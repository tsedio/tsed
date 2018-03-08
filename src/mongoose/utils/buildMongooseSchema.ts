import {JsonSchemesRegistry, PropertyMetadata, PropertyRegistry} from "@tsed/common";
import * as mongoose from "mongoose";

const clean = (src: any) => Object
    .keys(src)
    .reduce((obj: any, k: any) => {
        if (src[k]) {
            obj[k] = src[k];
        }
        return obj;
    }, {});

export function mapProps(jsonProps: any = {}) {
    let {pattern, minimum, maximum, minLength, maxLength} = jsonProps;
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
            let definition = {
                required: propertyMetadata.required
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

            definition = clean(Object.assign(definition, propertyMetadata.store.get("mongooseSchema") || {}));

            mSchema[propertyKey] = propertyMetadata.isArray ? [definition] : definition;
        });
    }

    return mSchema;
}