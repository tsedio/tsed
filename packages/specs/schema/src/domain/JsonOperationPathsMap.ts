import {OperationVerbs} from "../constants/OperationVerbs.js";
import {JsonMethodPath} from "./JsonOperation.js";

export class JsonOperationPathsMap extends Map<string, JsonMethodPath> {
  $kind: string = "operationPaths";
  readonly $isJsonDocument = true;

  setOperationPath(operationPath: JsonMethodPath) {
    // if (operationPath.method !== OperationVerbs.CUSTOM) {
    const key = this.getKey(operationPath.method, operationPath.path);
    this.set(key, operationPath);
    // }
  }

  protected getKey = (method: string, path: any) => `${method}-${path}`;
}
