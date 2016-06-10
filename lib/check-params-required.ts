import {parse} from "./parse";
/**
 *
 * @param expressionList
 * @param scope
 * @returns {string[]}
 */
export function checkParamsRequired(expressionList: string[], scope: IScope): string[] {
    return expressionList.filter((expression: string) => (
        parse(expression, scope) === undefined
    ));
}

