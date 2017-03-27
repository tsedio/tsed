/**
 * @module converters
 */ /** */

import {Converter} from "../decorators/converter";
import {isArrayOrArrayClass} from "../../core/utils";
import {ConverterService} from "../services/ConverterService";
import {IConverter} from "../interfaces/index";

/**
 * @private
 */
@Converter(Array)
export class ArrayConverter implements IConverter {

    constructor(private converterService: ConverterService) {}

    /**
     *
     * @param data
     * @param target
     * @param baseType
     * @returns {any[]}
     */
    deserialize<T>(data: any, target: any, baseType?: T): T[] {

        if (isArrayOrArrayClass(data)) {
            return (data as Array<any>).map(item =>
                this.converterService.deserialize(item, baseType)
            );
        }

        return [data];
    }

    /**
     *
     * @param data
     * @returns {any[]}
     */
    serialize(data: any[]) {
        return (data as Array<any>).map(item =>
            this.converterService.serialize(item)
        );
    }
}
