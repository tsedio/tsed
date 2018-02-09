import {
    AuthenticatedMiddleware,
    EndpointInfo,
    EndpointMetadata,
    Next,
    OverrideMiddleware,
    Req,
    Res
} from "@tsed/common";
import * as Express from "express";
import {Forbidden} from "ts-httpexceptions";

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