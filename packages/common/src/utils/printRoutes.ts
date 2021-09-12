import {$log, colorize} from "@tsed/logger";
import {PlatformRouteDetails} from "../domain/PlatformRouteDetails";

export function printRoutes(routes: PlatformRouteDetails[]) {
  const mapColor: {[key: string]: string} = {
    GET: "green",
    POST: "yellow",
    PUT: "blue",
    DELETE: "red",
    PATCH: "magenta",
    ALL: "cyan"
  };

  const list = routes.map((route) => {
    const obj = route.toJSON();
    const method = obj.method.toUpperCase();

    obj.method = {
      length: method.length,
      toString: () => {
        return colorize(method, mapColor[method]);
      }
    } as any;

    return obj;
  });

  const str = $log.drawTable(list, {
    padding: 1,
    header: {
      method: "Method",
      url: "Endpoint",
      name: "Class method"
    }
  });

  return "\n" + str.trim();
}
