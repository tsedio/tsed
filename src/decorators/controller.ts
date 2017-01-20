import {CONTROLLER_URL, CONTROLLER_DEPEDENCIES} from "../constants/metadata-keys";
import Metadata from "../metadata/metadata";

export function Controller(ctrlUrl: string, ...ctlrDepedencies: any[]): Function {

    return (target: any): void => {

        /* istanbul ignore next */
        if (!Metadata.has(CONTROLLER_URL, target)) {
            Metadata.set(CONTROLLER_URL, ctrlUrl, target);
            Metadata.set(CONTROLLER_DEPEDENCIES, ctlrDepedencies, target);
            // throw new Error(ERRORS_MSGS.DUPLICATED_CONTROLLER_DECORATOR(getClassName(target)));
        }


    };
}