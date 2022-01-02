import {Type} from "@tsed/core";
import {JsonMethodPath, JsonOperation} from "./JsonOperation";
import {JsonEntityStore} from "./JsonEntityStore";
import {concatPath} from "../utils/concatPath";
import {JsonParameterStore} from "./JsonParameterStore";

export class JsonOperationRoute<Entity extends JsonEntityStore = JsonEntityStore> {
  readonly token: Type<any>;
  readonly endpoint: Entity;
  readonly operationPath?: JsonMethodPath;
  readonly basePath?: string;

  constructor(options: Partial<JsonOperationRoute>) {
    Object.assign(this, options);
  }

  get url() {
    return this.fullPath;
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

  get name() {
    return `${this.endpoint.targetName}.${this.methodClassName}()`;
  }

  get className() {
    return this.endpoint.targetName;
  }

  get methodClassName() {
    return this.propertyKey;
  }

  get parameters() {
    return this.endpoint.parameters;
  }

  get propertyKey() {
    return String(this.endpoint.propertyKey);
  }

  get propertyName() {
    return this.endpoint.propertyName;
  }

  get store() {
    return this.endpoint.store;
  }

  get operation(): JsonOperation {
    return this.endpoint.operation as JsonOperation;
  }

  get operationId() {
    return this.operation.get("operationId") || this.endpoint.propertyKey;
  }
}
