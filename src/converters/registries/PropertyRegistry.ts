import {Metadata} from "../../core/class/Metadata";
/**
 * @module common/converters
 */
/** */
import {Type} from "../../core/interfaces/Type";
import {PropertyMetadata} from "../class/PropertyMetadata";
import {PROPERTIES_METADATA} from "../constants/index";

export class PropertyRegistry {
    /**
     *
     * @param target
     * @param propertyKey
     * @returns {any}
     */
    static get(target: Type<any>, propertyKey: string | symbol): PropertyMetadata {

        const properties = this.getProperties(target);

        if (!properties.has(propertyKey)) {
            this.set(target, propertyKey, new PropertyMetadata(target, propertyKey));
        }

        return this.getProperties(target).get(propertyKey);
    }

    /**
     *
     * @param target
     * @returns {Array}
     */
    static getProperties = (target: Type<any>): Map<string | symbol, PropertyMetadata> =>
        Metadata.has(PROPERTIES_METADATA, target)
            ? Metadata.get(PROPERTIES_METADATA, target)
            : new Map<string | symbol, PropertyMetadata>();
    /**
     *
     * @param target
     * @param propertyKey
     * @param property
     */
    static set(target: Type<any>, propertyKey: string | symbol, property: PropertyMetadata): void {

        const properties = this.getProperties(target);

        properties.set(propertyKey, property);

        Metadata.set(PROPERTIES_METADATA, properties, target);
    }

    /**
     *
     * @param target
     * @param propertyKey
     */
    static required(target: Type<any>, propertyKey: string | symbol) {
        const property = this.get(target, propertyKey);

        property.required = true;

        this.set(target, propertyKey, property);
        this.get(target, propertyKey).store.merge("responses", {
            "400": {
                description: "BadRequest"
            }
        });

        return this;
    }
}