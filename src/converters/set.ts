import {IConverter} from "../interfaces";
import {Converter} from "../decorators/class/converter";
import ConverterService from "../services/converter";

@Converter(Set)
export class SetConverter implements IConverter {
    constructor(private converterService: ConverterService) {}

    /**
     *
     * @param data
     * @param target
     * @param baseType
     * @returns {Map<string, T>}
     */
    deserialize<T>(data: any, target: any, baseType: T): Set<T> {
        const obj = new Set<T>();

        Object.keys(data).forEach(key => {

            obj.add(<T>this.converterService.deserialize(data[key], baseType));

        });

        return obj;

    }

    /**
     *
     * @param data
     */
    serialize<T>(data: Set<T>): any[] {
        const array = [];

        data.forEach((value) =>
            array.push(this.converterService.serialize(value))
        );

        return array;
    }
}