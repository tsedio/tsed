import {deepExtends} from "../../core/utils";
import {JsonSchema} from "../../jsonschema/class/JsonSchema";
import {PathParamsType} from "../../mvc/interfaces/PathParamsType";

/** */

export function toSwaggerPath(expressPath: PathParamsType): PathParamsType {
    if (typeof expressPath === "string") {
        let params = expressPath.match(/:[\w]+/g);

        let openAPIPath = expressPath;
        if (params) {
            let swagerParams = params.map(x => {
                return "{" + x.replace(":", "") + "}";
            });

            openAPIPath = params.reduce((acc, el, ix) => {
                return acc.replace(el, swagerParams[ix]);
            }, expressPath);
        }
        return openAPIPath;
    } else {
        return expressPath;
    }
}

export function swaggerType(type: any): string {
    return JsonSchema.getJsonType(type) as string;
}

export function getReducers(): { [key: string]: (collection: any[], value: any) => any } {
    const defaultReducer = (collection: any[], value: any) => {
        if (collection.indexOf(value) === -1) {
            collection.push(value);
        }
        return collection;
    };

    return {
        "default": defaultReducer,
        "security": (collection, value) => {
            const current = collection.find((current: any): any => {
                return Object.keys(value).find((key) => !!current[key]);
            });

            if (current) {
                deepExtends(current, value, {"default": defaultReducer});
            } else {
                collection.push(value);
            }

            return collection;
        },
        "parameters": (collection, value) => {

            const current = collection.find((current) =>
                current.in === value.in && current.name === value.name
            );

            if (current) {
                deepExtends(current, value);
            } else {
                collection.push(value);
            }

            return collection;
        }
    };
}