import {Metadata} from "@tsed/core";

export function getConstructorDependencies(target: any, propertyKey?: string | symbol | undefined) {
  return Metadata.getOwn("override:ctor:design:paramtypes", target, propertyKey) || [...Metadata.getParamTypes(target, propertyKey)] || [];
}

export function setConstructorDependencies(target: any, deps: any[]) {
  Metadata.set("override:ctor:design:paramtypes", deps, target);
}
