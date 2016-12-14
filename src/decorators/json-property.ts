
import {isTargetType} from '../utils/utils';
import {IJsonMetadata} from '../interfaces/JsonMetadata';
import Metadata from '../metadata/metadata';
import {JSON_METADATA, DESIGN_TYPE} from '../constants/metadata-keys';


export function JsonProperty<T>(metadata?: IJsonMetadata<T>|string): Function {

    return (target: any, propertyKey: string) => {

        if (propertyKey) {
            const baseType = Metadata.get(DESIGN_TYPE, target, propertyKey);

            let decoratorMetaData: IJsonMetadata<T> = {
                name: propertyKey,
                use: baseType,
                isArray: (baseType === Array || baseType instanceof Array)
            };

            if (isTargetType(metadata, 'string')) {
                decoratorMetaData.name = metadata as string;
            }
            else if (isTargetType(metadata, 'object')) {
                decoratorMetaData = Object.assign(decoratorMetaData, metadata as IJsonMetadata<T>);
            }

            Metadata.set(JSON_METADATA, decoratorMetaData, target, propertyKey);
        }

    };

}