import {PROPERTIES_METADATA} from "../../converters/constants/index";
import {Metadata} from "../../core/class/Metadata";
import {DecoratorParameters} from "../../core/interfaces";
import {Type} from "../../core/interfaces/Type";
import {ancestorsOf} from "../../core/utils";
import {PropertyMetadata} from "../class/PropertyMetadata";
import {InjectorService} from "../../di/services/InjectorService";
import {ConverterService} from "../../converters/services/ConverterService";

export class PropertyRegistry {
    /**
     *
     * @param target
     * @param propertyKey
     * @returns {PropertyMetadata}
     */
    static get(target: Type<any>, propertyKey: string | symbol): PropertyMetadata {

        const properties = this.getOwnProperties(target);

        if (!properties.has(propertyKey)) {
            this.set(target, propertyKey, new PropertyMetadata(target, propertyKey));
        }

        return this.getOwnProperties(target).get(propertyKey)!;
    }

    /**
     *
     * @param target
     * @returns {Array}
     */
    static getProperties(target: Type<any>): Map<string | symbol, PropertyMetadata> {
        const map = new Map<string | symbol, PropertyMetadata>();

        ancestorsOf(target).forEach((klass) => {
            this.getOwnProperties(klass).forEach((v: PropertyMetadata, k: string | symbol) => {
                map.set(k, v);
            });
        });

        return map;
    }

    /**
     *
     * @param {Type<any>} target
     * @returns {Map<string | symbol, PropertyMetadata>}
     */
    static getOwnProperties(target: Type<any>): Map<string | symbol, PropertyMetadata> {
        return Metadata.hasOwn(PROPERTIES_METADATA, target)
            ? Metadata.getOwn(PROPERTIES_METADATA, target)
            : new Map<string | symbol, PropertyMetadata>();
    }

    /**
     *
     * @param target
     * @param propertyKey
     * @param property
     */
    static set(target: Type<any>, propertyKey: string | symbol, property: PropertyMetadata): void {

        const properties = this.getOwnProperties(target);

        properties.set(propertyKey, property);

        Metadata.set(PROPERTIES_METADATA, properties, target);
    }

    /**
     *
     * @param target
     * @param propertyKey
     * @param allowedRequiredValues
     */
    static required(target: Type<any>, propertyKey: string | symbol, allowedRequiredValues: any[] = []) {
        const property = this.get(target, propertyKey);

        property.required = true;
        property.allowedRequiredValues = allowedRequiredValues;

        this.set(target, propertyKey, property);
        this.get(target, propertyKey).store.merge("responses", {
            "400": {
                description: "BadRequest"
            }
        });

        return this;
    }

    /**
     *
     * @param {(propertyMetadata: PropertyMetadata, parameters: DecoratorParameters) => void} fn
     * @returns {Function}
     */
    static decorate(fn: (propertyMetadata: PropertyMetadata, parameters: DecoratorParameters) => void): Function {
        return (...parameters: any[]): any => {
            const propertyMetadata = PropertyRegistry.get(parameters[0], parameters[1]);
            const result = fn(propertyMetadata, parameters as DecoratorParameters);
            if (typeof result === "function") {
                result(...parameters);
            }
        };
    }
}