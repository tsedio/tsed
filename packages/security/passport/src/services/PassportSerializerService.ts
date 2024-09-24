import {Type} from "@tsed/core";
import {Constant, Service} from "@tsed/di";
import {deserialize, serialize} from "@tsed/json-mapper";

import {UserInfo} from "../domain/UserInfo.js";

/**
 * @ignore
 */
@Service()
export class PassportSerializerService {
  @Constant("passport.userInfoModel", UserInfo)
  private model: Type<UserInfo> | boolean;

  serialize(user: UserInfo, done: any) {
    try {
      const obj = serialize(user, {type: this.model});

      // remove password from serialized object
      obj.password = undefined;

      done(null, JSON.stringify(obj));
    } catch (er) {
      // istanbul ignore next
      done(er);
    }
  }

  deserialize(obj: any, done: any) {
    try {
      const user = deserialize(JSON.parse(obj), {type: this.model});

      done(null, user);
    } catch (er) {
      done(er);
    }
  }
}
