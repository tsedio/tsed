import {ConverterService} from "@tsed/common";
import {$log} from "ts-log-debug";
import {Args, SocketSession} from "../../../../packages/socketio";
import {SocketMiddleware} from "../../../../packages/socketio/decorators/socketMiddleware";
import {User} from "../models/User";

@SocketMiddleware()
export class ConverterUserSocketMiddleware {
  constructor(private converterService: ConverterService) {}

  use(@Args(0) user: any[], @SocketSession session: Map<string, any>) {
    session.set("test", "test2");
    user = this.converterService.deserialize(user, User);
    $log.info("User =>", user);

    return [user];
  }
}
