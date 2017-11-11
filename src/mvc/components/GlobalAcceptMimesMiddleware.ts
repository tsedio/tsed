/**
 * @module common/mvc
 */
/** */
import {NotAcceptable} from "ts-httpexceptions";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {Middleware} from "../decorators/class/middleware";
import {Request} from "../../filters/decorators/request";
import {IMiddleware} from "../interfaces/index";

/**
 * @middleware
 */
@Middleware()
export class GlobalAcceptMimesMiddleware implements IMiddleware {

    constructor(private serverSettingsService: ServerSettingsService) {

    }

    use(@Request() request: any) {

        this.serverSettingsService
            .acceptMimes
            .forEach((mime) => {
                if (!request.accepts(mime)) {
                    throw new NotAcceptable(mime);
                }
            });
    }
}