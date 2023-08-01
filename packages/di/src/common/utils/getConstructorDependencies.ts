import {Metadata} from "@tsed/core";

export function getConstructorDependencies(target: any) {
  return [...(Metadata.get("override:ctor:design:paramtypes", target, undefined) || Metadata.getParamTypes(target) || [])];
}

export function setConstructorDependencies(target: any, deps: any[]) {
  Metadata.set("override:ctor:design:paramtypes", deps, target);
}
