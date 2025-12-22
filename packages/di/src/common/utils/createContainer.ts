import type {Type} from "@tsed/core/types/Type.js";

import {Container} from "../domain/Container.js";
import {Provider} from "../domain/Provider.js";

export function createContainer(rootModule?: Type<any>) {
  const container = new Container(Provider.Registry.entries());

  if (rootModule) {
    container.delete(rootModule);
  }

  return container;
}
