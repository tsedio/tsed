import {ConverterService} from "@tsed/common";
import {Args, SocketMiddleware} from "@tsed/socketio";
import {User} from "../models/User";

@SocketMiddleware()
export class UserConverterSocketMiddleware {
  constructor(private converterService: ConverterService) {
  }

  async use(@Args() args: any[]) {

    let [user] = args;
    // update Arguments
    user = this.converterService.deserialize(user, User);

    return [user];
  }
}
