import {JsonSchema, PathParamsType} from "@tsed/common";
import {deepExtends} from "@tsed/core";

/** */

export function toSwaggerPath(base: string, path: PathParamsType = ""): string {

    if (path instanceof RegExp) {
        path = path.toString()
            .replace(/^\//, "")
            .replace(/\/$/, "")
            .replace(/\\/, "");
    }

    const completePath = "" + base + path;

    // if (typeof expressPath === "string") {
    let params = completePath.match(/:[\w]+/g);

    let openAPIPath = completePath;
    if (params) {
        let swaggerParams = params.map(x => {
            return "{" + x.replace(":", "") + "}";
        });

        openAPIPath = params.reduce((acc, el, ix) => {
            return acc.replace(el, swaggerParams[ix]);
        }, completePath);
    }

    return ("" + openAPIPath)
        .replace(/\/\//gi, "/")
        .trim();
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