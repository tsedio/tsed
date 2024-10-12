import {UseBefore} from "@tsed/platform-middlewares";

import {OidcNoCacheMiddleware} from "../middlewares/OidcNoCacheMiddleware.js";

export function NoCache(): ClassDecorator {
  return UseBefore(OidcNoCacheMiddleware) as ClassDecorator;
}
