import {ALLOWED_VERBS} from "../constants/OperationVerbs";

export function mapOperationOptions(args: any[]) {
  let method: string | undefined = undefined;
  let path: string | RegExp | undefined = undefined;

  const handlers = args.filter((arg: any) => {
    if (typeof arg === "string" && ALLOWED_VERBS.includes(arg.toLowerCase())) {
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
