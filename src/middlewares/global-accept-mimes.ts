
import {IMiddleware, Middleware, Request} from "../";
import {NotAcceptable} from "ts-httpexceptions";
import {ServerSettingsService} from "../services/server-settings";


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