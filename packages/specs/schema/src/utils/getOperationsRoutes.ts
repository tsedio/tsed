import {Type} from "@tsed/core";
import {JsonMethodStore} from "../domain/JsonMethodStore";
import {getOperationsStores} from "./getOperationsStores";
import {JsonOperationRoute} from "../domain/JsonOperationRoute";
import {JsonEntityStore} from "../domain/JsonEntityStore";
import {getJsonEntityStore} from "./getJsonEntityStore";
import {concatPath} from "./concatPath";

export interface GetOperationsRoutesOptions {
  withChildren?: boolean;
  basePath?: string;
}

export function getOperationsRoutes<Entity extends JsonMethodStore = JsonMethodStore>(
  token: Type<any> | any,
  options: GetOperationsRoutesOptions = {}
): JsonOperationRoute<Entity>[] {
  const store: JsonEntityStore = token.isStore ? token : getJsonEntityStore(token);
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
    }

    return routes;
  }, operationsRoutes);
}
