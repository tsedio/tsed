import {isArrayOrArrayClass} from "../../core/utils";
import {Converter} from "../decorators/converter";
import {IConverter, IDeserializer, ISerializer} from "../interfaces/index";

/**
 * Converter component for the `Array` Type.
 * @private
 * @converters
 * @component
 */
@Converter(Array)
export class ArrayConverter implements IConverter {
    /**
     *
     * @param data
     * @param target
     * @param baseType
     * @param deserializer
     * @returns {any[]}
     */
    deserialize<T>(data: any, target: any, baseType: T, deserializer: IDeserializer): T[] {

        if (isArrayOrArrayClass(data)) {
            return (data as Array<any>).map(item =>
                deserializer!(item, baseType)
            );
        }

        return [data];
    }

    /**
     *
     * @param data
     * @param serializer
     * @returns {any[]}
     */
    serialize(data: any[], serializer: ISerializer) {
        return (data as Array<any>).map(item =>
            serializer(item)
        );
    }
}
