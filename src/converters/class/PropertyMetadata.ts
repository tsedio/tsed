import {Storable} from "../../core/class/Storable";
/**
 * @module common/converters
 */
/** */
import {IPropertyOptions} from "../interfaces/IPropertyOptions";

export class PropertyMetadata extends Storable implements IPropertyOptions {
    constructor(target: any, propertyKey: any) {
        super(target, propertyKey);
    }
}