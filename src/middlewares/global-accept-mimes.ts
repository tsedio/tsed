
import {NotAcceptable} from "ts-httpexceptions";
import {ServerSettingsService} from "../services/server-settings";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces/interfaces";
import {Request} from "../decorators/param/request";


@Middleware()
export default class GlobalAcceptMimesMiddleware implements IMiddleware {

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