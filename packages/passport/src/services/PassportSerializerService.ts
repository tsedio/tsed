import {ConverterService} from "@tsed/common";
import {Type} from "@tsed/core";
import {Constant, Service} from "@tsed/di";
import {UserInfo} from "../domain/UserInfo";

@Service()
export class PassportSerializerService {
  @Constant("passport.userInfoModel", UserInfo)
  private model: Type<UserInfo>;

  constructor(protected converterService: ConverterService) {}

  serialize(user: UserInfo, done: any) {
    try {
      const obj = this.converterService.serialize(user);

      delete obj.password;

      done(null, JSON.stringify(obj));
    } catch (er) {
      done(er);
    }
  }

  deserialize(obj: any, done: any) {
    try {
      const user = this.converterService.deserialize(JSON.parse(obj), this.model);

      done(null, user);
    } catch (er) {
      done(er);
    }
  }
}
