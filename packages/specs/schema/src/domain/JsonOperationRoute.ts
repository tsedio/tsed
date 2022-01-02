import {Type} from "@tsed/core";
import {JsonMethodStore} from "./JsonMethodStore";
import {JsonMethodPath, JsonOperation} from "./JsonOperation";
import {concatPath} from "../utils/concatPath";

export class JsonOperationRoute<Entity extends JsonMethodStore = JsonMethodStore> {
  readonly token: Type<any>;
  readonly endpoint: Entity;
  readonly operationPath?: JsonMethodPath;
  readonly basePath?: string;
  readonly paramsTypes: Record<string, boolean>;

  constructor(options: Partial<JsonOperationRoute>) {
    Object.assign(this, options);

    this.paramsTypes = [...this.endpoint.children.values()].reduce(
      (obj, item) => ({
        ...obj,
        [item.paramType]: true
      }),
      {}
    );
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

  has(key: string) {
    return this.paramsTypes[key];
  }
}
