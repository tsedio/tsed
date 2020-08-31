import {$log, colorize} from "@tsed/logger";
import {IRouteDetails} from "../../platform";

export function printRoutes(routes: IRouteDetails[]) {
  const mapColor: {[key: string]: string} = {
    GET: "green",
    POST: "yellow",
    PUT: "blue",
    DELETE: "red",
    PATCH: "magenta",
    ALL: "cyan"
  };

  routes = routes.map((route) => {
    const method = route.method.toUpperCase();

    route.method = {
      length: method.length,
      toString: () => {
        return colorize(method, mapColor[method]);
      }
    } as any;

    return route;
  });

  const str = $log.drawTable(routes, {
    padding: 1,
    header: {
      method: "Method",
      url: "Endpoint",
      name: "Class method"
    }
  });

  return "\n" + str.trim();
}
