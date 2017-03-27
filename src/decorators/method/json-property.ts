
import {isTargetType, isCollection, isEmpty} from "../../utils";
import {IJsonMetadata} from "../../interfaces";
import Metadata from "../../services/metadata";
import {JSON_PROPERTIES} from "../../constants/metadata-keys";
import InjectorService from "../../services/injector";
import ConverterService from "../../services/converter";

/**
 * `@JsonProperty()` let you decorate an attribut that can be serialized or deserialized. By default, no parameters are required to use it.
 * But in some cases, we need to configure explicitly the JSON attribut name mapped to the class attribut.
 * Here an example of different use cases with `@JsonProperty()`:
 *
 * ```typescript
 * class EventModel {
 *
 *    \@JsonProperty()
 *    name: string;
 *
 *    \@JsonProperty('startDate')
 *    startDate: Date;
 *
 *    \@JsonProperty({name: 'end-date'})
 *    endDate: Date;
 *
 *    \@JsonProperty({use: Task})
 *    tasks: TaskModel[];
 * }
 *
 * class TaskModel {
 *     subject: string;
 *     rate: number;
 * }
 *
 * > Theses ES6 collections can be used : Map and Set. Map will be serialized as an object and Set as an array.
 * By default Date, Array, Map and Set have a default custom Converter allready embded. But you can override theses (see next part).
 *
 * For the Array, you must add the `{use: baseType}` option to the decorator.
 * `TypeClass` will be used to deserialize each item in the collection stored on the attribut source.
 *
 * @param metadata
 * @returns {Function}
 * @constructor
 */
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
