import {Endpoint} from "../../controllers/endpoint";
import {UseBefore} from "../method/use-before";
import MultipartFileMiddleware from "../../middlewares/multipart-file";
import Metadata from "../../services/metadata";
import {MultipartFileFilter, MultipartFilesFilter} from "../../filters/multipart-file";
import EndpointParam from "../../controllers/endpoint-param";
import {Type} from "../../interfaces/interfaces";

export function MultipartFile(options?: any): Function {

    return <T> (target: Type<T>, propertyKey: string, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            // create endpoint metadata
            Endpoint.setMetadata(MultipartFileMiddleware, options, target, propertyKey);

            UseBefore(MultipartFileMiddleware)(target, propertyKey, parameterIndex);

            // add filter
            const filter = Metadata.getParamTypes(target, propertyKey)[parameterIndex] === Array
                ? MultipartFilesFilter : MultipartFileFilter;

            EndpointParam.useFilter(filter, {
                propertyKey,
                parameterIndex,
                target,
                useConverter: false
            });

        }

    };
}