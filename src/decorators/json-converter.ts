
import Metadata from '../metadata/metadata';
import {Converters} from '../converters/converters';
import {JSON_CONVERTERS} from '../constants/metadata-keys';
import {IStaticJsonConverter} from '../interfaces/JsonConverter';

export function JsonConverter(...classes: any[]): Function {

    return (customConverter: any): void => {

        classes.forEach((clazz) => {
            Metadata.set(JSON_CONVERTERS, customConverter, clazz);
        });

    };
}

export function DefaultJsonConverter(): Function {
    return (customConverter: IStaticJsonConverter): void => {
        Converters.setDefaultConverter(customConverter);
    }
}