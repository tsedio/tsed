import {parse} from "./parse";
import * as _ from "lodash";

export function checkParamsRequired(expressionList: string[], scope: any): string[] {
    return _.filter(expressionList, (expression) => (
        parse(expression, scope) === undefined
    ));
}