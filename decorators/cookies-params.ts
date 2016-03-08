
import {parse} from "../lib/parse";
import {attachInject} from "../lib/injector";

export function CookiesParams(expression: string): Function{

    return function(target: Function, propertyKey: string | symbol, parameterIndex: number): void {

        if(parameterIndex !== undefined){
            attachInject(target[propertyKey], parameterIndex, (request) => (parse(expression, request.cookies)));
        }

    }
}