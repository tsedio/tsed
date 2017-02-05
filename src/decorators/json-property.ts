
import {isTargetType, isCollection, isEmpty} from "../utils/utils";
import {IJsonMetadata} from "../interfaces/JsonMetadata";
import Metadata from "../services/metadata";
import {JSON_PROPERTIES} from "../constants/metadata-keys";
import InjectorService from "../services/injector";
import ConverterService from "../services/converter";


export function JsonProperty<T>(metadata?: IJsonMetadata<T>|string): Function {

    return (target: any, propertyKey: string) => {

        /* istanbul ignore else */
        if (propertyKey) {
            const baseType = Metadata.getType(target, propertyKey);

            let decoratorMetaData: IJsonMetadata<T> = {
                name: propertyKey,
                use: baseType,
                baseType: baseType
            };

            if (isTargetType(metadata, "string")) {
                decoratorMetaData.name = metadata as string;
            }
            else if (isTargetType(metadata, "object")) {

                decoratorMetaData = Object.assign(decoratorMetaData, metadata as IJsonMetadata<T>);

                if (isCollection(baseType) && !isEmpty((<IJsonMetadata<T>>metadata).use)) {
                    decoratorMetaData.use = baseType;
                    decoratorMetaData.baseType = (<IJsonMetadata<T>>metadata).use;
                }

            }

            decoratorMetaData.propertyKey = propertyKey;

            const properties: Map<string, IJsonMetadata<T>> = Metadata.get(JSON_PROPERTIES, target)
                || new Map<string, IJsonMetadata<T>>();

            properties.set(decoratorMetaData.propertyKey, decoratorMetaData);
            properties.set(decoratorMetaData.name, decoratorMetaData);

            Metadata.set(JSON_PROPERTIES, properties, target);

            if (!target.constructor.prototype.toJSON) {

                target.constructor.prototype.toJSON = function(){
                    return InjectorService
                        .invoke<ConverterService>(ConverterService)
                        .serialize(this);
                };
                target.constructor.prototype.toJSON.$ignore = true;

            }
        }

    };

}