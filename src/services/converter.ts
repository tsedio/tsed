
import {Service} from '../decorators/service';
import {isArrayOrArrayClass, isEmpty, isPrimitiveOrPrimitiveClass} from '../utils/utils';
import {JSON_DESERIALIZE_CONVERTER, JSON_SERIALIZE_CONVERTER} from '../constants/errors-msgs';
import {getClassName} from '../utils/class';
import Metadata from '../metadata/metadata';
import {CONVERTER, JSON_PROPERTIES} from '../constants/metadata-keys';
import {IJsonMetadata} from '../interfaces/JsonMetadata';
import {IConverter} from '../interfaces/Converter';


@Service()
export default class ConverterService {

    constructor() {

    }

    /**
     * Convert instance to plainObject.
     * @param obj
     */
    serialize(obj: any): any {

        try {

            if (isEmpty(obj)) {
                return obj;
            }

            const converter = this.getConverter(obj);

            if (converter) {
                // deserialize from a custom JsonConverter
                return converter.deserialize(obj);
            }

            if (typeof obj.serialize === "function") {
                // deserialize from serialize method
                return obj.serialize();
            }

            // Default converter
            /*if (!isPrimitiveOrPrimitiveClass(obj) && !isPrimitiveOrPrimitiveClass(targetType)) {

                const instance = new targetType();

                Object.keys(obj).forEach((propertyName: string) => {

                    const jsonMetadata = ConverterService.getJsonMetadata(targetType, propertyName) || {};
                    const propertyValue = obj[jsonMetadata.name] || obj[propertyName];

                    if (typeof instance[propertyName] !== 'function') {

                        instance[propertyName] = this.deserialize(
                            propertyValue,
                            jsonMetadata.use,
                            jsonMetadata.baseType
                        );
                    }

                });

                return instance;

            }*/


        } catch(err) {
            const castedError = new Error(JSON_SERIALIZE_CONVERTER(getClassName(obj), obj));
            castedError.stack = err.stack;
            throw castedError;
        }

        return obj;
    }

    /**
     *
     * @param instance
     * @returns {any}
     */
    /*private toPlainObject(instance: any) {

        if (!isEmpty(instance) && !isPrimitiveOrPrimitiveClass(instance)) {

            const converter: IConverter = this.getConverter(instance);

            if (converter && converter.serialize){
                // deserialize from a custom JsonConverter
                return converter.serialize(instance);

            }

            if(typeof instance.serialize === "function") {
                // deserialize from serialize method
                return instance.serialize(instance);
            }

            const plainObject = {};

            Object.getOwnPropertyNames(instance).forEach((propertyName) => {
                const jsonMetadata = ConverterService.getJsonMetadata(instance, propertyName);

                plainObject[jsonMetadata.name] = this.serialize(instance[propertyName]);
            });

            return plainObject;
        }

        return instance;
    }*/

    /**
     * Convert a plainObject to targetType.
     * @param obj
     * @param targetType
     * @param baseType
     * @returns {any}
     */
    deserialize(obj: any, targetType: any, baseType?: any): any {

        try {

            if (isEmpty(obj) || isEmpty(targetType)) {
                return obj;
            }

            const converter = this.getConverter(targetType);

            if (converter) {
                // deserialize from a custom JsonConverter
                return converter.deserialize(obj, targetType, baseType);
            }

            if ((<any>targetType).prototype && typeof (<any>targetType).prototype.deserialize === "function") {
                // deserialize from static method

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

                    if (typeof instance[propertyKey] !== 'function') {

                        instance[propertyKey] = this.deserialize(
                            propertyValue,
                            jsonMetadata.use,
                            jsonMetadata.baseType
                        );
                    }

                });

                return instance;

            }

        } catch(err) {
            const castedError = new Error(JSON_DESERIALIZE_CONVERTER(getClassName(targetType), obj));
            castedError.stack = err.stack;
            throw castedError;
        }


        return obj;
    }

    /**
     *
     * @param targetType
     * @returns {any}
     */
    getConverter(targetType: any): IConverter {

        const converter = Metadata.get(CONVERTER, targetType);

        if (converter) {
            return new converter(this);
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