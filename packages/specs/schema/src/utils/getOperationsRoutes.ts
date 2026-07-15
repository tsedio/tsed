import {Type} from "@tsed/core";

import {JsonMethodStore} from "../components/index.js";
import {OperationVerbs} from "../constants/OperationVerbs.js";
import {JsonOperationRoute} from "../domain/index.js";
import {getJsonEntityStore} from "../registries/JsonEntitiesContainer.js";
import {concatPath} from "./concatPath.js";
import {getOperationsStores} from "./getOperationsStores.js";

export interface GetOperationsRoutesOptions {
  withChildren?: boolean;
  basePath?: string;
  allowedVerbs?: OperationVerbs[];
}

export function getOperationsRoutes<Entity extends JsonMethodStore = JsonMethodStore>(
  token: Type<any> | any,
  options: GetOperationsRoutesOptions = {}
): JsonOperationRoute<Entity>[] {
  const store = getJsonEntityStore(token);
  const basePath = concatPath(options.basePath, store.path);
  let operationsRoutes: JsonOperationRoute<Entity>[] = [];

  if (options.withChildren) {
    const children = store.get<Type[]>("childrenControllers", []);

    operationsRoutes = children.reduce((operationsRoutes, token) => {
      return operationsRoutes.concat(
        getOperationsRoutes(token, {
          ...options,
          basePath
        })
      );
    }, operationsRoutes);
  }

  return [...getOperationsStores(token).values()].reduce((routes, endpoint) => {
    const {operation} = endpoint;

    if (operation) {
      operation.getAllowedOperationPath(options.allowedVerbs).forEach((operationPath) => {
        routes.push(
          new JsonOperationRoute<Entity>({
            basePath,
            token,
            endpoint,
            operationPath
          })
        );
      });
    }

    return routes;
  }, operationsRoutes);
}
