import {Container} from "../domain/Container.js";
import {Provider} from "../domain/Provider.js";
import type {Type} from "@tsed/core/types/Type.js";

export function createContainer(rootModule?: Type<any>) {
  const container = new Container(Provider.Registry.entries());

  if (rootModule) {
    container.delete(rootModule);
  }

  return container;
}
