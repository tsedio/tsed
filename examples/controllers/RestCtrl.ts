import {Controller, All, Next, Get, Response} from "../../index";
import {$log} from "ts-log-debug";
import {MongooseService} from "../services/MongooseService";

@Controller("/rest")
export class RestCtrl {

    constructor(
        private mongooseService: MongooseService
    ) {
        console.log(mongooseService);
    }

    @All('/')
    public all() {
        $log.debug("Route ALL /rest");
        return "REST";
    }
}