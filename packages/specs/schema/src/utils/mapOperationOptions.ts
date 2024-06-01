import {OperationVerbs} from "../constants/OperationVerbs.js";

const ALLOWED_VERBS = new Set([
  ...Object.keys(OperationVerbs)
    .filter((v) => v !== OperationVerbs.CUSTOM)
    .map((v) => v.toLowerCase())
]);

export function mapOperationOptions(args: any[]) {
  let method: string | undefined = undefined;
  let path: string | RegExp | undefined = undefined;

  const handlers = args.filter((arg: any) => {
    if (typeof arg === "string" && ALLOWED_VERBS.has(arg.toLowerCase())) {
      method = arg.toLocaleUpperCase();

      return false;
    }

    if (typeof arg === "string" || arg instanceof RegExp) {
      path = arg || "/";

      return false;
    }

    return !!arg;
  });

  return {
    path,
    method,
    use: handlers
  };
}
