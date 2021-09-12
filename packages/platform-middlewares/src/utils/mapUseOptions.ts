import {HTTP_METHODS} from "../constants";

export function mapUseOptions(args: any[]) {
  let method: string | undefined = undefined;
  let path: string | RegExp | undefined = undefined;

  const middlewares = args.filter((arg: any) => {
    if (typeof arg === "string" && HTTP_METHODS.includes(arg)) {
      method = arg;

      return false;
    }

    if (typeof arg === "string" || arg instanceof RegExp) {
      path = arg ? arg : "/";

      return false;
    }

    return !!arg;
  });

  return {
    path,
    method,
    middlewares
  };
}
