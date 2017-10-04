import {Metadata} from "../../core/class/Metadata";
/**
 * @module common/converters
 */
/** */
import {Type} from "../../core/interfaces/Type";
import {getClass, getInheritedClass, nameOf} from "../../core/utils";
import {PropertyMetadata} from "../class/PropertyMetadata";
import {PROPERTIES_METADATA} from "../constants/index";

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
        const classes = [];

        let currentTarget = getClass(target);

        while (nameOf(currentTarget) !== "") {
            classes.unshift(currentTarget);
            currentTarget = getInheritedClass(currentTarget);
        }

        classes.forEach((klass) => {
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