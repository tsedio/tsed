import {DecoratorTypes, isCollection, isPromise, Metadata} from "@tsed/core";
import {JsonEntityStore} from "./JsonEntityStore";
import {JsonOperation} from "./JsonOperation";
import {JsonSchema} from "./JsonSchema";
import type {JsonParameterStore} from "./JsonParameterStore";
import type {JsonClassStore} from "./JsonClassStore";
import {JsonEntityComponent} from "../decorators/config/jsonEntityComponent";

@JsonEntityComponent(DecoratorTypes.METHOD)
export class JsonMethodStore extends JsonEntityStore {
  readonly parent: JsonClassStore = JsonEntityStore.from(this.target);

  /**
   * Ref to JsonOperation when the decorated object is a method.
   */
  readonly operation: JsonOperation = new JsonOperation();
  /**
   * List of children JsonEntityStore (properties or methods or params)
   */
  readonly children: Map<string | number, JsonParameterStore> = new Map();

  get parameters(): JsonParameterStore[] {
    return [...this.children.values()] as JsonParameterStore[];
  }

  get operationPaths() {
    return this.operation.operationPaths;
  }

  getResponseOptions(status: number, contentType: string = "application/json"): undefined | any {
    const media = this.operation?.getResponseOf(status)?.getMedia(contentType, false);

    if (media && media.has("schema")) {
      const schema = media.get("schema") as JsonSchema;

      return {type: schema.getComputedItemType(), groups: media.groups};
    }

    return {type: this.type};
  }

  protected build() {
    if (!this._type) {
      let type: any = Metadata.getReturnType(this.target, this.propertyKey);
      type = isPromise(type) ? undefined : type;

      this.buildType(type);
    }

    this._type = this._type || Object;

    this.parent.children.set(this.propertyName, this);

    if (isCollection(this._type)) {
      this.collectionType = this._type;
      // @ts-ignore
      delete this._type;
    }

    this._schema = JsonSchema.from({
      type: this.collectionType || this.type
    });

    if (this.collectionType) {
      this._schema.itemSchema(this.type);
    }

    this.parent.schema.addProperty(this.propertyName, this.schema);
  }
}
