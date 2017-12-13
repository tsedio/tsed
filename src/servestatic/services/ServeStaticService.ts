import * as Express from "express";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {Service} from "../../di/decorators/service";
import {ExpressApplication} from "../../mvc/decorators";

@Service()
export class ServeStaticService {

    constructor(@ExpressApplication private expressApp: Express.Application,
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