import {Inject} from "../../di/decorators/inject";
import {ExpressApplication} from "../../core/services/ExpressApplication";
import {ServerSettingsService} from "../../server/services/ServerSettings";
import {Service} from "../../di/decorators/service";

@Service()
export class StaticsDirectoriesService {

    constructor(@Inject(ExpressApplication) private expressApp: ExpressApplication,
                private serverSettingsService: ServerSettingsService) {

    }

    $afterRoutesInit() {
        if (require.resolve("serve-static")) {
            const serveStatic = require("serve-static");

            Object.keys(this.serverSettingsService.serveStatic).forEach(key => {
                const middleware = serveStatic(this.serverSettingsService.serveStatic[key]);

                this.expressApp.use(key, (request, response, next) => {
                    /* istanbul ignore next */
                    if (!response.headersSent) {
                        middleware(request, response, next);
                    } else {
                        next();
                    }
                });
            });

        }
    }
}