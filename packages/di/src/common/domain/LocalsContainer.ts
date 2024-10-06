import {Hooks} from "@tsed/core";

import type {TokenProvider} from "../interfaces/TokenProvider.js";

export class LocalsContainer extends Map<TokenProvider, any> {
  readonly hooks = new Hooks();

  async destroy() {
    await this.hooks.asyncEmit("$onDestroy");
  }
}
