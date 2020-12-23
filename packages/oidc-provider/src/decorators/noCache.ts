import {UseBefore} from "@tsed/common";
import {OidcNoCacheMiddleware} from "../middlewares/OidcNoCacheMiddleware";

export function NoCache(): ClassDecorator {
  return UseBefore(OidcNoCacheMiddleware) as ClassDecorator;
}
