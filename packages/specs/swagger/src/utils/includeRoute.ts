import {ControllerProvider} from "@tsed/common";
import {matchPath} from "./matchPath";
import {SwaggerSettings} from "../interfaces/SwaggerSettings";

export function includeRoute(route: string, provider: ControllerProvider, conf: SwaggerSettings): boolean {
  const hidden = provider.store.get("hidden");
  const docs = provider.store.get("docs") || [];
  const {doc, pathPatterns} = conf;
  const inDoc = doc && docs.indexOf(doc) > -1;
  const pathPatternMatch = pathPatterns && matchPath(route, pathPatterns);

  if (hidden) {
    return false;
  }

  if (!doc && !pathPatterns) {
    return true;
  }

  return !!(inDoc || pathPatternMatch);
}
