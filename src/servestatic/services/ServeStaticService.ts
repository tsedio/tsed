/**
 * @module servestatic
 */
/** */
import {ExpressApplication} from "../../core/services/ExpressApplication";
import {Inject} from "../../di/decorators/inject";
import {Service} from "../../di/decorators/service";
import {ServerSettingsService} from "../../server/services/ServerSettingsService";

@Service()
export class ServeStaticService {

    constructor(@Inject(ExpressApplication) private expressApp: ExpressApplication,
                private serverSettingsService: ServerSettingsService) {

    }

    $afterRoutesInit() {
        /* istanbul ignore else */
        if (require.resolve("serve-static")) {
            Object
                .keys(this.serverSettingsService.serveStatic)
                .forEach(path => {
                    []
                        .concat(this.serverSettingsService.serveStatic[path] as any)
                        .forEach((directory: string) => this.mount(path, directory));
                });

        }
    }

    mount(path: string, directory: string) {
        const serveStatic = require("serve-static");
        const middleware = serveStatic(directory);
        this.expressApp.use(path, (request: any, response: any, next: any) => {
            if (!response.headersSent) {
                middleware(request, response, next);
            } else {
                next();
            }
        });
    }
}