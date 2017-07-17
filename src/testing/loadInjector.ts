/**
 * @module testing
 */
/** */

import {EnvTypes} from "../core/interfaces";
import {ExpressApplication} from "../core/services/ExpressApplication";
import {InjectorService} from "../di/services/InjectorService";
import {ServerSettingsProvider} from "../server/class/ServerSettingsProvider";
import {ServerSettingsService} from "../server/services/ServerSettingsService";
export function loadInjector() {
    if (!InjectorService.has(ExpressApplication)) {
        /* istanbul ignore next */
        const app = {
            use: () => (app),
            get: () => (app)
        };
        InjectorService.set(ExpressApplication, app);

        /* istanbul ignore else */
        if (!InjectorService.has(ServerSettingsService)) {

            const settingsProvider = new ServerSettingsProvider();
            settingsProvider.env = EnvTypes.TEST;

            InjectorService.set(ServerSettingsService, settingsProvider.$get());
        }
    }

    InjectorService.load();
}