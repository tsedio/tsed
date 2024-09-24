import {deserialize} from "@tsed/json-mapper";
import {Args, SocketMiddleware} from "@tsed/socketio";

import {User} from "../models/User";

@SocketMiddleware()
export class UserConverterSocketMiddleware {
  async use(@Args() args: any[]) {
    let [user] = args;
    // update Arguments
    user = deserialize(user, {type: User, useAlias: true});

    return [user];
  }
}
