import {Context} from "@tsed/common";
import {getValue} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {PassportMiddleware} from "@tsed/passport";

@Injectable()
export class OAuthParamsPipe {
  transform(context: Context) {
    const {options = {}} = context.endpoint.get(PassportMiddleware) || {};
    const key = context.endpoint.get(OAuthParamsPipe);

    return getValue(options, key);
  }
}
