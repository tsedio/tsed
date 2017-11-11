/**
 * @module testing
 */
/** */

import {globalServerSettings} from "../config";
import {Env} from "../core/interfaces";
import {ExpressApplication} from "../core/services/ExpressApplication";
import {InjectorService} from "../di/services/InjectorService";

export function loadInjector() {
    if (!InjectorService.has(ExpressApplication)) {
        /* istanbul ignore next */
        const app = {
            use: () => (app),
            get: () => (app)
        };
        InjectorService.set(ExpressApplication, app);
        globalServerSettings.env = Env.TEST;
    }

    InjectorService.load();
}