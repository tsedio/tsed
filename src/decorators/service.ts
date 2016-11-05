import Metadata from '../metadata/metadata';
import {PARAM_TYPES, DESIGN_PARAM_TYPES, SERVICE} from '../constants/metadata-keys';
import {DUPLICATED_SERVICE_DECORATOR} from '../constants/errors-msgs';
import {getClassName} from '../utils/class';

export function Service(): Function {

    return (target: any): void => {

        if (Metadata.has(PARAM_TYPES, target) === true) {
            throw new Error(DUPLICATED_SERVICE_DECORATOR(getClassName(target)));
        }

        const types = Metadata.get(DESIGN_PARAM_TYPES, target) || [];
        Metadata.set(PARAM_TYPES, types, target);
        Metadata.set(SERVICE, types, target);

        return target;
    };
}