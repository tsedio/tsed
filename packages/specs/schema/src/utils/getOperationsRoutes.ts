import {Type} from "@tsed/core";
import {getOperationsStores} from "./getOperationsStores";
import {JsonOperationRoute} from "../domain/JsonOperationRoute";
import {JsonEntityStore} from "../domain/JsonEntityStore";
import {getJsonEntityStore} from "./getJsonEntityStore";

export interface GetOperationsRoutesOptions {
  withChildren?: boolean;
  basePath?: string;
}

export function getOperationsRoutes<Entity extends JsonEntityStore = JsonEntityStore>(
  token: Type<any> | any,
  options: GetOperationsRoutesOptions = {}
): JsonOperationRoute<Entity>[] {
  const store: JsonEntityStore = token.isStore ? token : getJsonEntityStore(token);
  const basePath = ((options.basePath || "") + (store.path || "")).replace(/\/\//gi, "/");
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
      operation.operationPaths.forEach((operationPath) => {
        routes.push(
          new JsonOperationRoute<Entity>({
            basePath,
            token,
            endpoint,
            operationPath
          })
        );
      });

      if (!operation.operationPaths.size) {
        routes.push(
          new JsonOperationRoute<Entity>({
            basePath,
            token,
            endpoint
          })
        );
      }
    }

    return routes;
  }, operationsRoutes);
}
