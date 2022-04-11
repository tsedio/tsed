import {Args, SocketMiddleware, SocketSession} from "@tsed/socketio";
import {User} from "../models/User";
import {deserialize} from "@tsed/json-mapper";

@SocketMiddleware()
export class ConverterUserSocketMiddleware {
  use(@Args(0) user: any[], @SocketSession session: Map<string, any>) {
    session.set("test", "test2");
    user = deserialize(user, {type: User, useAlias: true});

    return [user];
  }
}
