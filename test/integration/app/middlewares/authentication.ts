import {
    AuthenticatedMiddleware,
    EndpointInfo,
    EndpointMetadata,
    Next,
    OverrideMiddleware,
    Req,
    Res
} from "@tsed/common";
import {getClass, nameOf} from "@tsed/core";
import * as Express from "express";
import {BadRequest, Forbidden} from "ts-httpexceptions";
import {TokenService} from "../services/TokenService";

@OverrideMiddleware(AuthenticatedMiddleware)
export class CustomAuthMiddleware {
    constructor(private tokenService: TokenService) {
    }

    public use(@EndpointInfo() endpoint: EndpointMetadata,
               @Req() request: Express.Request,
               @Res() response: Express.Response,
               @Next() next: Express.NextFunction) {

        if (request.get("authorization") !== "token") {
            next(new Forbidden("Forbidden"));

            return;
        }

        if (!this.tokenService.isValid(request.get("authorization")!)) {
            next(new BadRequest("Bad token format"));

            return;
        }

        next();

    }
}