import {DecoratorTypes} from "@tsed/core";
import type {JsonMethodStore} from "./JsonMethodStore.js";
import type {JsonPropertyStore} from "./JsonPropertyStore.js";
import {JsonEntityStore, JsonEntityStoreOptions} from "./JsonEntityStore.js";
import {JsonSchema} from "./JsonSchema.js";
import {JsonEntityComponent} from "../decorators/config/jsonEntityComponent.js";

@JsonEntityComponent(DecoratorTypes.CLASS)
export class JsonClassStore extends JsonEntityStore {
  /**
   * List of children JsonEntityStore (properties or methods or params)
   */
  readonly children: Map<string | number, JsonMethodStore | JsonPropertyStore> = new Map();

  get path() {
    return this.store.get("path", "/");
  }

  set path(path: string) {
    this.store.set("path", path);
  }

  protected build() {
    if (!this._type) {
      this.buildType(this.target);
    }

    this._type = this._type || Object;

    this._schema = JsonSchema.from({
      type: this.type
    });
  }
}
