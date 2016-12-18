import Metadata from "../metadata/metadata";
import {DESIGN_PARAM_TYPES, SERVICE} from "../constants/metadata-keys";

export function Service(): Function {

    return (target: any): void => {

        const types = Metadata.get(DESIGN_PARAM_TYPES, target) || [];
        Metadata.set(SERVICE, types, target);

        return target;
    };
}