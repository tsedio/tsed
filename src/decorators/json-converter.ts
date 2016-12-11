
import Metadata from '../../dts/metadata/metadata';
import Converters from '../converters/converters';
import {JSON_CONVERTERS} from '../constants/metadata-keys';

export function JsonConverter(...classes: any[]): Function {

    return (customConverter: any): void => {

        classes.forEach((clazz) => {
            Metadata.set(JSON_CONVERTERS, customConverter, clazz);
        });

    };
}

export function DefaultJsonConverter(): Function {
    return (customConverter: IStaticJsonConverter<any>): void => {
        Converters.setDefaultConverter(customConverter);
    }
}