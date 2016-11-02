
import * as ERRORS_MSGS from "../constants/errors-msgs";
import {getClassName} from '../utils/class';
import {CONTROLLER_URL, CONTROLLER_DEPEDENCIES, PARAM_TYPES, DESIGN_PARAM_TYPES} from '../constants/metadata-keys';
import Metadata from '../metadata/metadata';

export function Controller(ctrlUrl: string, ...ctlrDepedencies: any[]): Function {

    return (target: any): void => {

        if (Metadata.has(CONTROLLER_URL, target) === true) {
            throw new Error(ERRORS_MSGS.DUPLICATED_CONTROLLER_DECORATOR(getClassName(target)));
        }

        Metadata.set(CONTROLLER_URL, ctrlUrl, target);
        Metadata.set(CONTROLLER_DEPEDENCIES, ctlrDepedencies, target);

        const types = Metadata.get(DESIGN_PARAM_TYPES, target) || [];
        Metadata.set(PARAM_TYPES, types, target);
    };
}