
import {Service} from "../decorators/class/service";
import {isEmpty, isPrimitiveOrPrimitiveClass, isArrayOrArrayClass} from "../utils";
import {CONVERTER_DESERIALIZE, CONVERTER_SERIALIZE} from "../constants/errors-msgs";
import {getClassName} from "../utils";
import Metadata from "./metadata";
import {CONVERTER, JSON_PROPERTIES} from "../constants/metadata-keys";
import {IJsonMetadata} from "../interfaces";
import {IConverter} from "../interfaces";
import {BadRequest} from "ts-httpexceptions";
import InjectorService from "./injector";

@Service()
export default class ConverterService {

    constructor(private injectorService: InjectorService) {

    }

    /**
     * Convert instance to plainObject.
     * @param obj
     */
    public serialize(obj: any): any {

        try {

            if (isEmpty(obj)) {
                return obj;
            }

            const converter = this.getConverter(obj);

            if (converter && converter.serialize) {

                // deserialize from a custom JsonConverter
                return converter.serialize(obj);
            }

            if (typeof obj.serialize === "function") {
                // deserialize from serialize method
                return obj.serialize();
            }

            if (typeof obj.toJSON === "function" && !obj.toJSON.$ignore) {
                // deserialize from serialize method
                return obj.toJSON();
            }

            // Default converter
            if (!isPrimitiveOrPrimitiveClass(obj)) {

                const plainObject = isArrayOrArrayClass(obj) ? [] : {};

                Object.getOwnPropertyNames(obj).forEach(propertyKey => {

                    if (typeof obj[propertyKey] !== "function") {
                        const jsonMetadata = ConverterService.getJsonMetadata(obj, propertyKey) || {};

                        plainObject[jsonMetadata.name || propertyKey] = this.serialize(obj[propertyKey]);
                    }

                });

                return plainObject;
            }

        } catch (err) {
            /* istanbul ignore next */
            (() => {
                const castedError = new Error(CONVERTER_SERIALIZE(getClassName(obj), obj));
                castedError.stack = err.stack;
                throw castedError;
            })();
        }

        /* istanbul ignore next */
        return obj;
    }

    /**
     * Convert a plainObject to targetType.
     * @param obj
     * @param targetType
     * @param baseType
     * @returns {any}
     */
    deserialize(obj: any, targetType: any, baseType?: any): any {

        try {

            if (targetType !== Boolean && (isEmpty(obj) || isEmpty(targetType))) {
                return obj;
            }

            const converter = this.getConverter(targetType);

            if (converter) {
                // deserialize from a custom JsonConverter
                return converter.deserialize(obj, targetType, baseType);
            }

            /* istanbul ignore next */
            if (isArrayOrArrayClass(obj)) {
                const converter = this.getConverter(Array);
                return converter.deserialize(obj, Array, baseType);
            }

            if ((<any>targetType).prototype && typeof (<any>targetType).prototype.deserialize === "function") {
                // deserialize from method

                const instance = new targetType();
                instance.deserialize(obj);

                return instance;
            }



            // Default converter
            if (!isPrimitiveOrPrimitiveClass(obj) && !isPrimitiveOrPrimitiveClass(targetType)) {

                const instance = new targetType();

                Object.keys(obj).forEach((propertyName: string) => {
                    const jsonMetadata = ConverterService.getJsonMetadata(targetType, propertyName) || {};
                    const propertyValue = obj[jsonMetadata.name] || obj[propertyName];
                    const propertyKey = jsonMetadata.propertyKey || propertyName;

                    try {

                        if (typeof instance[propertyKey] !== "function") {

                            instance[propertyKey] = this.deserialize(
                                propertyValue,
                                jsonMetadata.use,
                                jsonMetadata.baseType
                            );
                        }

                    } catch (err) {
                        /* istanbul ignore next */
                        (() => {
                            const castedError = new Error("For " + propertyKey + " with value " + propertyValue +  " \n" + err.message);
                            castedError.stack = err.stack;
                            throw castedError;
                        })();
                    }


                });

                return instance;

            }

        } catch (err) {

            /* istanbul ignore next */
            if (err.name === "BAD_REQUEST") {
                throw new BadRequest(err.message);
            } else {
                /* istanbul ignore next */
                (() => {
                    const castedError = new Error(CONVERTER_DESERIALIZE(getClassName(targetType), obj) + "\n" + err.message);
                    castedError.stack = err.stack;
                    throw castedError;
                })();
            }

        }

        return obj;
    }

    /**
     *
     * @param targetType
     * @returns {any}
     */
    public getConverter(targetType: any): IConverter {

        const converter = Metadata.get(CONVERTER, targetType);

        if (converter) {
            return this.injectorService.invoke(converter);
        }

    }

    /**
     * Return a JsonMetadata for a properties.
     * @param targetClass
     * @param propertyKey
     * @returns {undefined|V|string|any|T|IDBRequest}
     */
    static getJsonMetadata(targetClass, propertyKey: string): IJsonMetadata<any> {
        return this.getJsonProperties(targetClass).get(propertyKey);
    }

    /**
     * Return all properties for a class.
     * @param targetClass
     * @returns {any|Map<string, IJsonMetadata>}
     */
    static getJsonProperties(targetClass): Map<string, IJsonMetadata<any>> {
        return Metadata.get(JSON_PROPERTIES, targetClass) || new Map<string, IJsonMetadata<any>>();
    }
}