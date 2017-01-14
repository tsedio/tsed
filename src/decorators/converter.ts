
import Metadata from "../metadata/metadata";
import {CONVERTER} from "../constants/metadata-keys";

export function Converter(...classes: any[]): Function {

    return customConverter => {

        classes.forEach(clazz =>
            Metadata.set(CONVERTER, customConverter, clazz)
        );

    };
}