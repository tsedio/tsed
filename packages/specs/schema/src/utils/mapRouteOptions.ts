import {HTTP_METHODS} from "../constants/httpMethods";

export function mapRouteOptions(args: any[]) {
  let method: string | undefined = undefined;
  let path: string | RegExp | undefined = undefined;

  const handlers = args.filter((arg: any) => {
    if (typeof arg === "string" && HTTP_METHODS.includes(arg.toLowerCase())) {
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
