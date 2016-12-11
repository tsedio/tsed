import {isPrimitiveOrPrimitiveClass} from '../utils/utils';
import Metadata from '../metadata/metadata';
import {JSON_CONVERTERS} from '../constants/metadata-keys';
import {JSON_DESERIALIZE_CONVERTER, JSON_SERIALIZE_CONVERTER} from '../constants/errors-msgs';
import {getClassName} from '../utils/class';
import {IStaticJsonConverter} from '../interfaces/JsonConverter';
import {IJsonConverter} from '../../dts/interfaces/JsonConverter';

export default class Converters<Map> {

    private static defaultConverter: IStaticJsonConverter;

    /**
     *
     * @param customConvert
     */
    static setDefaultConverter(customConvert: IStaticJsonConverter): void {
        this.defaultConverter = customConvert;
    }
    /**
     * Deserialize any type to his class.
     * @param obj
     * @param targetType
     * @returns {any}
     */
    static deserialize<T extends IStaticJsonConverter>(obj: any, targetType: IStaticJsonConverter): T {

        try {
            if (!this.isEmpty(obj)
                && targetType !== undefined
                && !isPrimitiveOrPrimitiveClass(obj)
                && !isPrimitiveOrPrimitiveClass(targetType)) {

                const converter = this.getConverter<T>(targetType);

                if (converter){
                    // deserialize from a custom JsonConverter
                    obj = converter.deserialize<T>(obj, targetType);

                } else if(typeof targetType.deserialize === "function") { // static
                    // deserialize from static method
                    obj = targetType.deserialize(obj, targetType);

                } else if((<any>targetType).prototype && typeof (<any>targetType).prototype.deserialize === "function") {
                    // deserialize from static method
                    obj = new targetType().deserialize(obj);

                }
                else if (this.defaultConverter) {
                    obj = this.defaultConverter.deserialize<T>(obj, targetType);
                }
                else {
                    // last chance to deserialize object from his object
                    obj = new (<any>targetType)(obj);
                }

            }

        } catch(err) {
            const castedError = new Error(JSON_DESERIALIZE_CONVERTER(getClassName(targetType), obj));
            castedError.stack = err.stack;
            throw castedError;
        }


        return obj;
    }

    /**
     *
     * @param obj
     * @returns {string}
     */
    static serialize(obj: any): string {

        let json: string = obj;

        try {
            if (!this.isEmpty(obj)
                && !isPrimitiveOrPrimitiveClass(obj)) {

                const converter = this.getConverter<any>(obj);

                if (converter){
                    // deserialize from a custom JsonConverter
                    json = converter.serialize(obj);

                } else if(typeof obj.serialize === "function") {
                    // deserialize from serialize method
                    json = obj.serialize(obj);

                } else {
                    // last chance to serialize object from toJson method.
                    json = JSON.stringify(obj);
                }

            }

        } catch(err) {
            const castedError = new Error(JSON_SERIALIZE_CONVERTER(getClassName(obj), obj));
            castedError.stack = err.stack;
            throw castedError;
        }

        return json;
    }

    /**
     * Return the right converter for a type.
     * @param targetType
     * @returns {any}
     */
    static getConverter<T>(targetType: any): IStaticJsonConverter {
        return Metadata.get(JSON_CONVERTERS, targetType);
    }

    static isEmpty = (value: any): boolean =>
        value === "" || value === null || value === undefined;

}