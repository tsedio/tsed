import {Type} from "@tsed/core";
import {Container} from "../class/Container";
import {GlobalProviders} from "../registries/GlobalProviders";

export function createContainer(rootModule?: Type<any>) {
  const container = new Container(GlobalProviders.entries());

  if (rootModule) {
    container.delete(rootModule);
  }

  return container;
}
