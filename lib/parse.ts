import * as _ from "lodash";

export function parse(expression: string, scope: any): any {
    let keys: string[] = expression.split(".");

    while ((scope = scope[keys.shift()]) && keys.length) {}

    return typeof scope === "object" ? _.clone(scope) : scope;
}