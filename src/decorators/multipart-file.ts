import {Endpoint} from "../controllers/endpoint";
import {UseBefore} from "./use-before";
import MultipartFileMiddleware from "../middlewares/multipart-file";
import InjectParams from "../services/inject-params";
import {MULTIPARTFILE, MULTIPARTFILES} from "../constants/metadata-keys";
import Metadata from "../services/metadata";

export function MultipartFile(options?: any): Function {

    return <T> (target: Function, propertyKey: string, parameterIndex: number): void => {

        if (!Endpoint.getMetadata(MultipartFileMiddleware, target, propertyKey)){

            Endpoint.setMetadata(MultipartFileMiddleware, options, target, propertyKey);

            UseBefore(MultipartFileMiddleware)(target, propertyKey, parameterIndex);

            const key = Metadata.getParamTypes(target, propertyKey)[parameterIndex] === Array
                ? MULTIPARTFILES : MULTIPARTFILE;

            InjectParams.build(key, {
                propertyKey,
                parameterIndex,
                target,
                useConverter: false
            });

        }

    };
}