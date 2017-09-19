/**
 * @module swagger
 */
/** */
import {BaseParameter} from "./baseparameter";
import {Tag} from "./tag";
import { getDecoratorType } from '../../core/utils/index';
import { ControllerRegistry } from '../../mvc/registries/ControllerRegistry';

export function Name(name: string) {
    
    return (...args: any[]) => {
        const [target, propertyKey, descriptor] = args;  
        const type = getDecoratorType(args);
        switch (type) {
            case "parameter": return BaseParameter({name})(...args);
            case "class": if(ControllerRegistry.has(target)) return Tag({name})(...args);
            default: throw new Error('Name on Property and Method Not Supported');
        }
    };  
}