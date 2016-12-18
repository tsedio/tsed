
import ConverterService from '../services/converter';
import {Converter} from '../decorators/converter';
import {IConverter} from '../interfaces/Converter';

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
    deserialize<T>(data: any[], target: any, baseType?: T): T[] {
        return (data as Array<any>).map(item =>
            this.converterService.deserialize(item, baseType)
        );
    }
}
