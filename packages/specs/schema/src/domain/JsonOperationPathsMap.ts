import {OperationMethods} from "../constants/httpMethods";
import {JsonMethodPath} from "./JsonOperation";

export class JsonOperationPathsMap extends Map<string, JsonMethodPath> {
  setOperationPath(operationPath: JsonMethodPath) {
    if (operationPath.method !== OperationMethods.CUSTOM) {
      const key = this.getKey(operationPath.method, operationPath.path);
      this.updateFinalRouteState(key);
      this.updateFinalRouteState(this.getKey(OperationMethods.ALL, operationPath.path));
      this.setFinalRoute(key, operationPath);
    }
  }

  protected getKey = (method: string, path: any) => `${method}-${path}`;

  protected updateFinalRouteState(key: string) {
    if (this.has(key)) {
      this.get(key)!.isFinal = false;
    }
  }

  protected setFinalRoute(key: string, operationPath: JsonMethodPath) {
    this.set(key, operationPath);
    operationPath.isFinal = true;
  }
}
