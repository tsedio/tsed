import {BadRequest} from "ts-httpexceptions";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {Store} from "../../core";
import {Metadata} from "../../core/class/Metadata";
import {Type} from "../../core/interfaces";
import {getClass, isArrayOrArrayClass, isEmpty, isPrimitiveOrPrimitiveClass} from "../../core/utils";
import {InjectorService} from "../../di";
import {Service} from "../../di/decorators/service";
import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";
import {CONVERTER} from "../constants/index";
import {ConverterDeserializationError} from "../errors/ConverterDeserializationError";
import {ConverterSerializationError} from "../errors/ConverterSerializationError";
import {RequiredPropertyError} from "../errors/RequiredPropertyError";
import {UnknowPropertyError} from "../errors/UnknowPropertyError";
import {IConverter, IConverterOptions, IDeserializer, ISerializer} from "../interfaces/index";


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
     *
     * ### Options
     *
     * - `checkRequiredValue`: Disable the required check condition.
     *
     * @param obj
     * @param options
     */
    serialize(obj: any, options: IConverterOptions = {}): any {
        const {
            checkRequiredValue = true
        } = options;

        try {

            if (isEmpty(obj)) {
                return obj;
            }

            const converter = this.getConverter(obj);
            const serializer: ISerializer = (o: any) => this.serialize(o, options);

            if (converter && converter.serialize) {
                // deserialize from a custom JsonConverter
                return converter.serialize(obj, serializer);
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

                        this.checkStrictModelValidation(obj, propertyKey, propertyMetadata);

                        propertyMetadata = propertyMetadata || {} as any;
                        plainObject[propertyMetadata!.name || propertyKey] = this.serialize(obj[propertyKey]);
                    }
                });

                // Required validation
                if (checkRequiredValue) {
                    this.checkRequiredValue(obj, properties);
                }

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
     *
     * ### Options
     *
     * - `ignoreCallback`: callback called for each object which will be deserialized. The callback can return a boolean to avoid the default converter behavior.
     * - `checkRequiredValue`: Disable the required check condition.
     *
     * @param obj Object source that will be deserialized
     * @param targetType Pattern of the object deserialized
     * @param baseType
     * @param options
     * @returns {any}
     */
    deserialize(obj: any, targetType: any, baseType?: any, options: IConverterOptions = {}): any {
        const {
            ignoreCallback,
            checkRequiredValue = true
        } = options;

        try {
            if (ignoreCallback && ignoreCallback(obj, targetType, baseType)) {
                return obj;
            }

            if (targetType !== Boolean && (isEmpty(obj) || isEmpty(targetType) || targetType === Object)) {
                return obj;
            }

            const converter = this.getConverter(targetType);
            const deserializer: IDeserializer = (o: any, targetType: any, baseType: any) =>
                this.deserialize(o, targetType, baseType, options);

            if (converter) {
                // deserialize from a custom JsonConverter
                return converter!.deserialize!(obj, targetType, baseType, deserializer);
            }

            /* istanbul ignore next */
            if (isArrayOrArrayClass(obj)) {
                const converter = this.getConverter(Array);
                return converter!.deserialize!(obj, Array, baseType, deserializer);
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
                return this.convertProperty(obj, instance, propertyName, propertyMetadata, options);
            });

            // Required validation
            if (checkRequiredValue) {
                this.checkRequiredValue(instance, properties);
            }

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
     * @param targetType
     * @returns {any}
     */
    getConverter(targetType: any): IConverter | undefined {

        const converter = Metadata.get(CONVERTER, targetType);

        if (converter) {
            return this.injectorService.invoke(converter);
        }
    }

    /**
     *
     * @param obj
     * @param instance
     * @param {string} propertyName
     * @param {PropertyMetadata} propertyMetadata
     * @param options
     */
    private convertProperty(obj: any, instance: any, propertyName: string, propertyMetadata?: PropertyMetadata, options?: any) {

        this.checkStrictModelValidation(instance, propertyName, propertyMetadata);

        propertyMetadata = propertyMetadata || {} as any;

        const propertyValue = obj[propertyMetadata!.name] || obj[propertyName];
        const propertyKey = propertyMetadata!.propertyKey || propertyName;

        try {

            if (typeof instance[propertyKey] !== "function") {
                instance[propertyKey] = this.deserialize(
                    propertyValue,
                    propertyMetadata!.isCollection ? propertyMetadata!.collectionType : propertyMetadata!.type,
                    propertyMetadata!.type,
                    options
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
    }

    /**
     *
     * @param instance
     * @param {Map<string | symbol, PropertyMetadata>} properties
     */
    private checkRequiredValue(instance: any, properties: Map<string | symbol, PropertyMetadata>) {
        properties.forEach((propertyMetadata: PropertyMetadata) => {
            if (!propertyMetadata.isValidRequiredValue(instance[propertyMetadata.propertyKey])) {
                throw new RequiredPropertyError(getClass(instance), propertyMetadata.propertyKey);
            }
        });
    }

    /**
     *
     * @param instance
     * @param {string} propertyKey
     * @param {PropertyMetadata | undefined} propertyMetadata
     */
    private checkStrictModelValidation(instance: any, propertyKey: string, propertyMetadata: PropertyMetadata | undefined) {
        if (this.isStrictModelValidation(getClass(instance)) && propertyMetadata === undefined) {
            throw new UnknowPropertyError(getClass(instance), propertyKey);
        }
    }

    /**
     *
     * @param {Type<any>} target
     * @returns {boolean}
     */
    private isStrictModelValidation(target: Type<any>): boolean {

        if (target !== Object) {
            const modelStrict = Store.from(target).get("modelStrict");

            if (this.validationModelStrict) {
                return modelStrict === undefined ? true : modelStrict;
            } else {
                return modelStrict === true;
            }
        }

        return false;
    }
}