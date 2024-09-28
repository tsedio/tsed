import {Type} from "@tsed/core";

import {Container} from "../domain/Container.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";

export function createContainer(rootModule?: Type<any>) {
  const container = new Container(GlobalProviders.entries());

  if (rootModule) {
    container.delete(rootModule);
  }

  return container;
}
