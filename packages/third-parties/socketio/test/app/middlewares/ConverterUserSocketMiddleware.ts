import {deserialize} from "@tsed/json-mapper";

import {Args, SocketMiddleware, SocketSession} from "../../../src/index.js";
import {User} from "../models/User.js";

@SocketMiddleware()
export class ConverterUserSocketMiddleware {
  use(@Args(0) user: any[], @SocketSession session: SocketSession) {
    session.set("test", "test2");
    user = deserialize(user, {type: User, useAlias: true});

    return [user];
  }
}
