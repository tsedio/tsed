/**
 * @module swagger
 */
/** */
import {BaseParameter} from "./baseparameter";
import {Operation} from "./operation";
import {Schema} from "./schema";
import {Tag} from "./tag";
import { Store } from '../../core/class/Store';
import { DecoratorParameters } from '../../core/interfaces/DecoratorParameters';
import { getDecoratorType } from '../../core/utils';
import { ControllerRegistry } from '../../mvc/registries/ControllerRegistry';

export function Description(description: string) {
 
    return (...args: any[]) => {
        const [target, propertyKey, descriptor] = args;   
        const type = getDecoratorType(args);
        switch (type) {
            case "parameter": return BaseParameter({description})(...args);
            case "method": return Operation({description})(...args);
            case "class": if(ControllerRegistry.has(target)) return Tag({description})(...args);
            default: return Schema({description})(...args);
        }
    };  
}