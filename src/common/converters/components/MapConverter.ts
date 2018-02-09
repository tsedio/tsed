import {Converter} from "../decorators/converter";
import {IConverter, IDeserializer, ISerializer} from "../interfaces/index";
import {ConverterService} from "../services/ConverterService";

/**
 * Converter component for the `Map` Type.
 * @private
 * @converters
 * @component
 */
@Converter(Map)
export class MapConverter implements IConverter {
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
    deserialize<T>(data: any, target: any, baseType: T, deserializer: IDeserializer): Map<string, T> {

        const obj = new Map<string, T>();

        Object.keys(data).forEach(key => {

            obj.set(key, <T>deserializer(data[key], baseType));

        });

        return obj;
    }

    /**
     *
     * @param data
     * @param serializer
     */
    serialize<T>(data: Map<string, T>, serializer: ISerializer): any {
        const obj: any = {};

        data.forEach((value: T, key: string) =>
            obj[key] = serializer(value)
        );

        return obj;
    }
}
