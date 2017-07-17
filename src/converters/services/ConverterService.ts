import {BadRequest} from "ts-httpexceptions";
import {Metadata} from "../../core/class/Metadata";
import {Type} from "../../core/interfaces/Type";
import {isArrayOrArrayClass, isEmpty, isPrimitiveOrPrimitiveClass} from "../../core/utils";
import {InjectorService} from "../../di";
/**
 * @module common/converters
 */
/** */
import {Service} from "../../di/decorators/service";
import {PropertyMetadata} from "../class/PropertyMetadata";
import {CONVERTER} from "../constants/index";
import {ConverterDeserializationError} from "../errors/ConverterDeserializationError";
import {ConverterSerializationError} from "../errors/ConverterSerializationError";
import {IConverter} from "../interfaces/index";
import {PropertyRegistry} from "../registries/PropertyRegistry";

@Service()
export class ConverterService {

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
                        const jsonMetadata = ConverterService.getJsonMetadata(obj, propertyKey) || {} as any;

                        plainObject[jsonMetadata.name || propertyKey] = this.serialize(obj[propertyKey]);
                    }

                });

                return plainObject;
            }

        } catch (err) {
            /* istanbul ignore next */
            throw new ConverterSerializationError(obj, err);
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

            if (targetType !== Boolean && (isEmpty(obj) || isEmpty(targetType) || targetType === Object)) {
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
            // if (!isPrimitiveOrPrimitiveClass(obj) && !isPrimitiveOrPrimitiveClass(targetType)) {

            const instance = new targetType();

            Object.keys(obj).forEach((propertyName: string) => {
                const jsonMetadata = ConverterService.getJsonMetadata(targetType, propertyName) || {} as any;
                const propertyValue = obj[jsonMetadata.name] || obj[propertyName];
                const propertyKey = jsonMetadata.propertyKey || propertyName;

                try {

                    if (typeof instance[propertyKey] !== "function") {

                        instance[propertyKey] = this.deserialize(
                            propertyValue,
                            jsonMetadata.isCollection ? jsonMetadata.collectionType : jsonMetadata.type,
                            jsonMetadata.type
                        );
                    }

                } catch (err) {
                    /* istanbul ignore next */
                    (() => {
                        const castedError = new Error("For " + propertyKey + " with value " + propertyValue + " \n" + err.message);
                        castedError.stack = err.stack;
                        throw castedError;
                    })();
                }


            });

            return instance;

            // }

        } catch (err) {

            /* istanbul ignore next */
            if (err.name === "BAD_REQUEST") {
                throw new BadRequest(err.message);
            } else {
                /* istanbul ignore next */
                throw new ConverterDeserializationError(targetType, obj, err);
            }

        }
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
    static getJsonMetadata(targetClass, propertyKey: string): PropertyMetadata {
        const properties = this.getJsonProperties(targetClass);

        if (properties.has(propertyKey)) {
            return properties.get(propertyKey);
        }

        let property;
        properties.forEach(p => {
            if (p.name === propertyKey || p.propertyKey === propertyKey) {
                property = p;
            }
        });

        return property;
    }

    /**
     * Return all properties for a class.
     * @returns {any|Map<string, IPropertyMetadata>}
     * @param target
     */
    static getJsonProperties(target: Type<any>): Map<string | symbol, PropertyMetadata> {
        return PropertyRegistry.getProperties(target);
    }
}