import {JSONSchema4, JSONSchema4Type, JSONSchema4TypeName} from "json-schema";
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

export class JsonSchema implements JSONSchema4 {
    @NotEnumerable()
    private _refName: string;
    /**
     *
     * @type {string}
     */
    @Enumerable()
    $id: string;

    @Enumerable()
    properties: { [key: string]: JSONSchema4 };

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
    default: JSONSchema4Type;

    @Enumerable()
    multipleOf: number;

    @Enumerable()
    maximum: number;

    @Enumerable()
    exclusiveMaximum: boolean;

    @Enumerable()
    minimum: number;

    @Enumerable()
    exclusiveMinimum: boolean;

    @Enumerable()
    maxLength: number;

    @Enumerable()
    minLength: number;

    @Enumerable()
    pattern: string;

    @Enumerable()
    additionalItems: boolean | JSONSchema4;

    @Enumerable()
    items: JSONSchema4 | JSONSchema4[];

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
    additionalProperties: boolean | JSONSchema4;

    @Enumerable()
    definitions: { [p: string]: JSONSchema4 };

    @Enumerable()
    patternProperties: { [p: string]: JSONSchema4 };

    @Enumerable()
    dependencies: { [p: string]: JSONSchema4 | string[] };

    @Enumerable()
    enum: JSONSchema4Type[];

    @NotEnumerable()
    private _type: JSONSchema4TypeName | JSONSchema4TypeName[] = "object";

    @Enumerable()
    allOf: JSONSchema4[];

    @Enumerable()
    anyOf: JSONSchema4[];

    @Enumerable()
    oneOf: JSONSchema4[];

    @Enumerable()
    not: JSONSchema4;

    @Enumerable()
    extends: string | string[];

    @Enumerable()
    format: string;

    [key: string]: any;

    @Enumerable()
    get type(): any | JSONSchema4TypeName | JSONSchema4TypeName[] {
        return this._type;
    }

    set type(value: any | JSONSchema4TypeName | JSONSchema4TypeName[]) {
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
     * @returns {JSONSchema4TypeName | JSONSchema4TypeName[]}
     */
    static getJsonType(value: any): JSONSchema4TypeName | JSONSchema4TypeName[] {

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
     * @returns {JSONSchema4}
     */
    static ref(type: any): JSONSchema4 {
        return {
            $ref: `#/definitions/${nameOf(type)}`
        };
    }
}