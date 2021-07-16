import {ControllerProvider} from "../domain/ControllerProvider";

export function getControllerPath(basePath: string, provider: ControllerProvider): string {
  return (basePath === provider.path ? provider.path : (basePath || "") + provider.path).replace(/\/\//gi, "/");
}
