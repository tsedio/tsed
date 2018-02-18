import {Converter} from "../decorators/converter";
import {IConverter, IDeserializer, ISerializer} from "../interfaces/index";
import {ConverterService} from "../services/ConverterService";

/**
 * Converter component for the `Set` Type.
 * @private
 * @converters
 * @component
 */
@Converter(Set)
export class SetConverter implements IConverter {
    constructor(private converterService: ConverterService) {
    }

    /**
     *
     * @param data
     * @param target
     * @param baseType
     * @param deserializer
     * @returns {Map<string, T>}
     */
    deserialize<T>(data: any, target: any, baseType: T, deserializer: IDeserializer): Set<T> {
        const obj = new Set<T>();

        Object.keys(data).forEach(key => {

            obj.add(<T>deserializer(data[key], baseType));

        });

        return obj;

    }

    /**
     *
     * @param data
     * @param serializer
     */
    serialize<T>(data: Set<T>, serializer: ISerializer): any[] {
        const array: any[] = [];

        data.forEach((value) =>
            array.push(serializer(value))
        );

        return array;
    }
}