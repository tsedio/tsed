import {Type} from "@tsed/core";
import {OperationVerbs} from "../constants/OperationVerbs";
import {JsonEntityStore} from "../domain/JsonEntityStore";
import {JsonMethodStore} from "../domain/JsonMethodStore";
import {JsonOperationRoute} from "../domain/JsonOperationRoute";
import {concatPath} from "./concatPath";
import {getJsonEntityStore} from "./getJsonEntityStore";
import {getOperationsStores} from "./getOperationsStores";

export interface GetOperationsRoutesOptions {
  withChildren?: boolean;
  basePath?: string;
  allowedVerbs?: OperationVerbs[];
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
