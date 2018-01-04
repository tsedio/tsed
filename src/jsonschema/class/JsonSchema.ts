import {JSONSchema6, JSONSchema6Type, JSONSchema6TypeName} from "json-schema";
import {Enumerable, NotEnumerable} from "../../core/decorators";
import {
    descriptorOf,
    isArrayOrArrayClass,
    isDate,
    isPrimitiveOrPrimitiveClass,
    nameOf,
    primitiveOf
} from "../../core/utils";

export const JSON_TYPES = ["string", "number", "integer", "boolean", "object", "array", "null", "any"];

export class JsonSchema implements JSONSchema6 {
    @NotEnumerable()
    private _refName: string;
    /**
     *
     * @type {string}
     */
    @Enumerable()
    $id: string;

    @Enumerable()
    properties: { [key: string]: JSONSchema6 };

    @Enumerable()
    id: string;

    @Enumerable()
    $ref: string;

    @Enumerable()
    $schema: any;

    @Enumerable()
    title: string;

    @Enumerable()
    description: string;

    @Enumerable()
    default: JSONSchema6Type;

    @Enumerable()
    multipleOf: number;

    @Enumerable()
    maximum: number;

    @Enumerable()
    exclusiveMaximum: number;

    @Enumerable()
    minimum: number;

    @Enumerable()
    exclusiveMinimum: number;

    @Enumerable()
    maxLength: number;

    @Enumerable()
    minLength: number;

    @Enumerable()
    pattern: string;

    @Enumerable()
    additionalItems: boolean | JSONSchema6;

    @Enumerable()
    items: JSONSchema6 | JSONSchema6[];

    @Enumerable()
    maxItems: number;

    @Enumerable()
    minItems: number;

    @Enumerable()
    uniqueItems: boolean;

    @Enumerable()
    maxProperties: number;

    @Enumerable()
    minProperties: number;

    @Enumerable()
    required: any | string[];

    @Enumerable()
    additionalProperties: boolean | JSONSchema6;

    @Enumerable()
    definitions: { [p: string]: JSONSchema6 };

    @Enumerable()
    patternProperties: { [p: string]: JSONSchema6 };

    @Enumerable()
    dependencies: { [p: string]: JSONSchema6 | string[] };

    @Enumerable()
    enum: JSONSchema6Type[];

    @NotEnumerable()
    private _type: JSONSchema6TypeName | JSONSchema6TypeName[] = "object";

    @Enumerable()
    allOf: JSONSchema6[];

    @Enumerable()
    anyOf: JSONSchema6[];

    @Enumerable()
    oneOf: JSONSchema6[];

    @Enumerable()
    not: JSONSchema6;

    @Enumerable()
    extends: string | string[];

    @Enumerable()
    format: string;

    [key: string]: any;

    @Enumerable()
    get type(): any | JSONSchema6TypeName | JSONSchema6TypeName[] {
        return this._type;
    }

    set type(value: any | JSONSchema6TypeName | JSONSchema6TypeName[]) {
        this._refName = nameOf(value);
        this._type = JsonSchema.getJsonType(value);
    }

    get refName() {
        return this._refName;
    }

    /**
     *
     * @returns {{}}
     */
    toJSON() {
        return Object
            .getOwnPropertyNames(JsonSchema.prototype)
            .reduce((acc: any, key: string) => {

                if (key === "refName") {
                    return acc;
                }

                const descriptor = descriptorOf(JsonSchema, key) || {enumerable: true};

                if (descriptor.enumerable && typeof descriptor.value !== "function") {
                    const value = (this as any)[key];
                    if (value !== undefined) {
                        acc[key] = value;
                    }
                }
                return acc;
            }, {});
    }

    /**
     *
     * @param value
     * @returns {JSONSchema6TypeName | JSONSchema6TypeName[]}
     */
    static getJsonType(value: any): JSONSchema6TypeName | JSONSchema6TypeName[] {

        if (isPrimitiveOrPrimitiveClass(value)) {
            if (JSON_TYPES.indexOf(value as string) > -1) {
                return value;
            }
            return primitiveOf(value);
        }

        if (isArrayOrArrayClass(value)) {
            if (value !== Array) {
                return value;
            }
            return "array";
        }

        if (isDate(value)) {
            return "string";
        }

        return "object";
    }

    /**
     *
     * @param type
     * @returns {JSONSchema6}
     */
    static ref(type: any): JSONSchema6 {
        return {
            $ref: `#/definitions/${nameOf(type)}`
        };
    }
}