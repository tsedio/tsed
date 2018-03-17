import {ConverterService} from "@tsed/common";
import {$log} from "ts-log-debug";
import {Args} from "../../../../src/socketio";
import {SocketMiddleware} from "../../../../src/socketio/decorators/socketMiddleware";
import {User} from "../models/User";

@SocketMiddleware()
export class ConverterUserSocketMiddleware {
    constructor(private converterService: ConverterService) {

    }

    use(@Args(0) userName: string[]) {

        const user = this.converterService.deserialize({name: userName}, User);
        $log.info("User =>", user);
        return [
            user
        ];
    }
}