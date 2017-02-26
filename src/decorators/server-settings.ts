import {IServerSettings} from "../services/server-settings";
import Metadata from "../services/metadata";
/**
 *
 * @param settings
 * @returns {(target:any)=>any}
 * @constructor
 */
export function ServerSettings(settings: IServerSettings): Function {

    return (target: any) => {

        Metadata.set("server:settings", settings, target);

    };

}