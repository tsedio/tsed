import {Type} from "@tsed/core";
import {Container, GlobalProviders} from "@tsed/di";

export function createContainer(rootModule?: Type<any>) {
  const container = new Container(GlobalProviders.entries());

  if (rootModule) {
    container.delete(rootModule);
  }

  return container;
}
