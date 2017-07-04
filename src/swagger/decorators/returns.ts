/**
 * @module swagger
 */
/** */
import {EndpointRegistry} from "../../mvc/registries/EndpointRegistry";
import {IResponsesOptions} from "../interfaces/interfaces";

export function Returns(code: number, options: IResponsesOptions = {}) {
    return <T>(target: any, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        const endpoint = EndpointRegistry.get(target as any, targetKey);

        endpoint
            .store
            .merge("responses", {
                [code]: {
                    description: options.description,
                    headers: options.headers,
                    type: options.use,
                    collectionType: options.collection
                }
            });

        return descriptor;
    };
}