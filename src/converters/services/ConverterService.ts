import {BadRequest} from "ts-httpexceptions";
import {Metadata} from "../../core/class/Metadata";
import {getClass, isArrayOrArrayClass, isEmpty, isPrimitiveOrPrimitiveClass} from "../../core/utils";
import {InjectorService} from "../../di";
import {Service} from "../../di/decorators/service";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";
import {CONVERTER} from "../constants/index";
import {ConverterDeserializationError} from "../errors/ConverterDeserializationError";
import {ConverterSerializationError} from "../errors/ConverterSerializationError";
import {RequiredPropertyError} from "../errors/RequiredPropertyError";
import {UnknowPropertyError} from "../errors/UnknowPropertyError";
import {IConverter} from "../interfaces/index";

@Service()
export class ConverterService {
    private validationModelStrict = true;

    constructor(private injectorService: InjectorService, serverSettings: ServerSettingsService) {
        this.validationModelStrict = serverSettings.get<boolean>("validationModelStrict");
    }

    /**
     * Return a JsonMetadata for a properties.
     * @param properties
     * @param propertyKey
     * @returns {undefined|V|string|any|T|IDBRequest}
     */
    static getPropertyMetadata(properties: Map<string | symbol, PropertyMetadata>, propertyKey: string): PropertyMetadata | undefined {

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

                const plainObject: any = isArrayOrArrayClass(obj) ? [] : {};
                const properties = PropertyRegistry.getProperties(obj);

                Object.keys(obj).forEach(propertyKey => {
                    if (typeof obj[propertyKey] !== "function") {
                        let propertyMetadata = ConverterService.getPropertyMetadata(properties, propertyKey);

                        if (this.validationModelStrict && getClass(obj) !== Object && propertyMetadata === undefined) {
                            throw new UnknowPropertyError(getClass(obj), propertyKey);
                        }

                        propertyMetadata = propertyMetadata || {} as any;
                        plainObject[propertyMetadata!.name || propertyKey] = this.serialize(obj[propertyKey]);
                    }
                });

                // Required validation
                properties.forEach((propertyMetadata: PropertyMetadata) => {
                    const key = propertyMetadata.name || propertyMetadata.propertyKey;
                    if (!propertyMetadata.isValidRequiredValue(plainObject[key])) {
                        throw new RequiredPropertyError(getClass(obj), propertyMetadata.propertyKey);
                    }
                });

                return plainObject;
            }

        } catch (err) {
            if (err.name === "BAD_REQUEST") {
                throw new BadRequest(err.message);
            } else {
                /* istanbul ignore next */
                throw new ConverterSerializationError(getClass(obj), err);
            }
        }

        /* istanbul ignore next */
        return obj;
    }

    /**
     * Convert a plainObject to targetType.
     * @param obj Object source that will be deserialized
     * @param targetType Pattern of the object deserialized
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
                return converter!.deserialize!(obj, targetType, baseType);
            }

            /* istanbul ignore next */
            if (isArrayOrArrayClass(obj)) {
                const converter = this.getConverter(Array);
                return converter!.deserialize!(obj, Array, baseType);
            }

            if ((<any>targetType).prototype && typeof (<any>targetType).prototype.deserialize === "function") {
                // deserialize from method

                const instance = new targetType();
                instance.deserialize(obj);

                return instance;
            }


            // Default converter
            const instance = new targetType();
            const properties = PropertyRegistry.getProperties(targetType);

            Object.keys(obj).forEach((propertyName: string) => {
                const propertyMetadata = ConverterService.getPropertyMetadata(properties, propertyName);
                return this.convertProperty(obj, instance, propertyName, propertyMetadata);
            });

            // Required validation
            properties.forEach((propertyMetadata: PropertyMetadata) => {
                if (!propertyMetadata.isValidRequiredValue(instance[propertyMetadata.propertyKey])) {
                    throw new RequiredPropertyError(targetType, propertyMetadata.propertyKey);
                }
            });

            return instance;
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
     * @param obj
     * @param instance
     * @param {string} propertyName
     * @param {PropertyMetadata} propertyMetadata
     */
    private convertProperty = (obj: any, instance: any, propertyName: string, propertyMetadata?: PropertyMetadata) => {


        if (this.validationModelStrict && getClass(instance) !== Object && propertyMetadata === undefined) {
            throw new UnknowPropertyError(getClass(instance), propertyName);
        }

        propertyMetadata = propertyMetadata || {} as any;

        const propertyValue = obj[propertyMetadata!.name] || obj[propertyName];
        const propertyKey = propertyMetadata!.propertyKey || propertyName;

        try {

            if (typeof instance[propertyKey] !== "function") {
                instance[propertyKey] = this.deserialize(
                    propertyValue,
                    propertyMetadata!.isCollection ? propertyMetadata!.collectionType : propertyMetadata!.type,
                    propertyMetadata!.type
                );
            }

        } catch (err) {
            /* istanbul ignore next */
            (() => {
                const castedError = new Error("For " + String(propertyKey) + " with value " + propertyValue + " \n" + err.message);
                castedError.stack = err.stack;
                throw castedError;
            })();
        }
    };

    /**
     *
     * @param targetType
     * @returns {any}
     */
    public getConverter(targetType: any): IConverter | undefined {

        const converter = Metadata.get(CONVERTER, targetType);

        if (converter) {
            return this.injectorService.invoke(converter);
        }
    }
}