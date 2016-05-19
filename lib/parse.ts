
const clone = (src: any): any => (
    JSON.parse(JSON.stringify(src))
);

export function parse(expression: string, scope: any): any {
    let keys: string[] = expression.split(".");

    while ((scope = scope[keys.shift()]) && keys.length) {}

    return typeof scope === "object" ? clone(scope) : scope;
}