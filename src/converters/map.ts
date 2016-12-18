import ConverterService from '../services/converter';
import {IConverter} from '../interfaces/Converter';
import {Converter} from '../decorators/converter';

@Converter(Map)
export class MapConverter implements IConverter {
    constructor(private converterService: ConverterService) {}

    /**
     *
     * @param data
     * @param target
     * @param baseType
     * @returns {Map<string, T>}
     */
    deserialize<T>(data: any, target: any, baseType: T): Map<string, T> {

        const obj = new Map<string, T>();

        Object.keys(data).forEach(key  => {

            obj.set(key, <T>this.converterService.deserialize(data[key], baseType));

        });

        return obj;
    }
}
