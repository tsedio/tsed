/**
 * @module mvc
 */
/** */
import {NotAcceptable} from "ts-httpexceptions";
import {ServerSettingsService} from "../../server/services/ServerSettings";
import {Middleware} from "../decorators/class/middleware";
import {Request} from "../decorators/param/request";
import {IMiddleware} from "../interfaces/index";

@Middleware()
export class GlobalAcceptMimesMiddleware implements IMiddleware {

    constructor(private serverSettingsService: ServerSettingsService) {

    }

    use(@Request() request) {

        this.serverSettingsService
            .acceptMimes
            .forEach((mime) => {
                if (!request.accepts(mime)) {
                    throw new NotAcceptable(mime);
                }
            });
    }
}