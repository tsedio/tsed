import {$log, colorize} from "@tsed/logger";

import {PlatformRouteDetails} from "../domain/PlatformRouteDetails.js";

export function printRoutes(routes: PlatformRouteDetails[]) {
  const mapColor: {[key: string]: string} = {
    GET: "green",
    POST: "yellow",
    PUT: "blue",
    DELETE: "red",
    PATCH: "magenta",
    ALL: "cyan",
    STATICS: "white"
  };

  const list = routes.map((route) => {
    const method = route.method.toUpperCase();

    return {
      ...route,
      method: {
        length: method.length,
        toString: () => {
          return colorize(method, mapColor[method]);
        }
      }
    };
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
