
import {Service} from '../decorators/service';

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
     * @returns {any}
     */
    eval(expression: string, scope: any) {
        let keys: string[] = expression.split(".");

        while ((scope = scope[keys.shift()]) && keys.length) {}

        return typeof scope === "object" ? ParseService.clone(scope) : scope;
    }
}
