import {IServerSettings} from "../../services/server-settings";
import Metadata from "../../services/metadata";
import {SERVER_SETTINGS} from "../../constants/metadata-keys";
/**
 *
 * @param settings
 * @returns {(target:any)=>any}
 * @constructor
 */
export function ServerSettings(settings: IServerSettings): Function {

    return (target: any) => {

        Metadata.set(SERVER_SETTINGS, settings, target);

    };

}