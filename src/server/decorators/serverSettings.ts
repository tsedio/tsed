/**
 * @module common/server
 */ /** */

import {Metadata} from "../../core/class/Metadata";
import {Type} from "../../core/interfaces/Type";
import {SERVER_SETTINGS} from "../constants/index";
import {IServerSettings} from "../interfaces/IServerSettings";
/**
 *
 * @param settings
 * @returns {(target:any)=>any}
 * @decorator
 */
export function ServerSettings(settings: IServerSettings): Function {

    return (target: Type<any>) => {

        Metadata.set(SERVER_SETTINGS, settings, target);

    };

}