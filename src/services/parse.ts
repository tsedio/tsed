
import {Service} from "../decorators/class/service";
import {isEmpty} from "../utils";

@Service()
export default class ParseService {

    constructor() {}

    /**
     * Clone an object.
     * @param src
     */
    static clone = (src: any): any => JSON.parse(JSON.stringify(src));

    /**
     * Eval an expression with a scope context and return value.
     * @param expression
     * @param scope
     * @param clone
     * @returns {any}
     */
    eval(expression: string, scope: any, clone: boolean = true): any {

        if (isEmpty(expression)) {
            return typeof scope === "object" && clone ? ParseService.clone(scope) : scope;
        }

        let keys: string[] = expression.split(".");

        while ((scope = scope[keys.shift()]) && keys.length) {}

        return typeof scope === "object" && clone ? ParseService.clone(scope) : scope;
    }
}
