import {nameOf, Type} from "@tsed/core";

import {getJsonEntityStore} from "../utils/getJsonEntityStore.js";

export class JsonLazyRef {
  readonly isLazyRef = true;

  constructor(readonly getType: () => Type<any>) {}

  get target() {
    return this.getType();
  }

  get schema() {
    return getJsonEntityStore(this.getType()).schema;
  }

  get name() {
    return nameOf(this.getType());
  }
}
