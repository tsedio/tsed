import * as Express from "express";
import {Forbidden} from "ts-httpexceptions";
import {EndpointInfo} from "../../../../src/filters/decorators/endpointInfo";
import {Next} from "../../../../src/filters/decorators/next";
import {Req} from "../../../../src/filters/decorators/request";
import {Res} from "../../../../src/filters/decorators/response";
import {EndpointMetadata} from "../../../../src/mvc/class/EndpointMetadata";
import {AuthenticatedMiddleware} from "../../../../src/mvc/components/AuthenticatedMiddleware";
import {OverrideMiddleware} from "../../../../src/mvc/decorators/class/overrideMiddleware";

@OverrideMiddleware(AuthenticatedMiddleware)
export class CustomAuthMiddleware {
    public use(@EndpointInfo() endpoint: EndpointMetadata,
               @Req() request: Express.Request,
               @Res() response: Express.Response,
               @Next() next: Express.NextFunction) {

        if (request.get("authorization") !== "token") {
            next(new Forbidden("Forbidden"));
            return;
        }

        next();

    }
}