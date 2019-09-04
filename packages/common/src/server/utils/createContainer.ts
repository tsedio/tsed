import {classOf} from "@tsed/core";
import {Container, GlobalProviders} from "@tsed/di";

export function createContainer(rootModule?: any) {
  const container = new Container(GlobalProviders.entries());

  if (rootModule) {
    container.delete(classOf(rootModule));
  }

  return container;
}
