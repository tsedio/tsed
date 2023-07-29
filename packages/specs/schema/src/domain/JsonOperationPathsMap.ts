import {OperationMethods} from "../constants/httpMethods";
import {JsonMethodPath} from "./JsonOperation";

export class JsonOperationPathsMap extends Map<string, JsonMethodPath> {
  kind: string = "operationPaths";

  setOperationPath(operationPath: JsonMethodPath) {
    if (operationPath.method !== OperationMethods.CUSTOM) {
      const key = this.getKey(operationPath.method, operationPath.path);
      this.set(key, operationPath);
    }
  }

  protected getKey = (method: string, path: any) => `${method}-${path}`;
}
