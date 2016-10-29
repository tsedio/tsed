import {checkParamsRequired} from "./check-params-required";
import {BadRequest} from "ts-httpexceptions";
/**
 *
 * @param required
 * @param scope
 * @param next
 */
export function tryParams(required: string[], scope: any, next: Function): void {

    let result = checkParamsRequired(required, scope);

    if (result.length) {
        next(new BadRequest("Parameters required " + result.join(", ") + "."));
    } else {
        next();
    }
}