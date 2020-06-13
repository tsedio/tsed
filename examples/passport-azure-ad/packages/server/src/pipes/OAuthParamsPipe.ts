import {OAuthBearerOptions} from "../protocols/BearerStrategy";
import {Injectable} from "@tsed/di";
import {Context} from "@tsed/common";
import {} from "@tsed/common";
import {getValue} from "@tsed/core";

@Injectable()
export class OAuthParamsPipe {
  transform(context: Context) {
    const options = context.endpoint.get(OAuthBearerOptions) || {};
    const key = context.endpoint.get(OAuthParamsPipe);

    return getValue(key, options);
  }
}
