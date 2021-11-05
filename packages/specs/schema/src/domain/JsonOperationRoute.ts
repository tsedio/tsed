import {Type} from "@tsed/core";
import {JsonMethodPath} from "./JsonOperation";
import {JsonEntityStore} from "./JsonEntityStore";
import {concatPath} from "../utils/concatPath";

export class JsonOperationRoute<Entity extends JsonEntityStore = JsonEntityStore> {
  readonly token: Type<any>;
  readonly endpoint: Entity;
  readonly operationPath?: JsonMethodPath;
  readonly basePath?: string;

  constructor(options: Partial<JsonOperationRoute>) {
    Object.assign(this, options);
  }

  get path() {
    return this.operationPath?.path;
  }

  get fullPath() {
    return concatPath(this.basePath, this.path as any);
  }

  get method() {
    return this.operationPath?.method || "USE";
  }

  get isFinal() {
    return !!this.operationPath?.isFinal;
  }

  get propertyKey() {
    return this.endpoint.propertyKey;
  }

  get store() {
    return this.endpoint.store;
  }
}
