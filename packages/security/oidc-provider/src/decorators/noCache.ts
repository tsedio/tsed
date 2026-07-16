import {OidcNoCacheMiddleware} from "../middlewares/OidcNoCacheMiddleware.js";
import {UseBefore} from "@tsed/platform-middlewares";

export function NoCache(): ClassDecorator {
  return UseBefore(OidcNoCacheMiddleware) as ClassDecorator;
}
