import {Controller, All, Next, Get, Response, RouterController} from "../../../src/index";
import {$log} from "ts-log-debug";
import {MongooseService} from "../services/MongooseService";

@Controller("/rest")
export class RestCtrl {

    constructor(
        private mongooseService: MongooseService
    ) {

    }

    @All('/')
    public all() {
        return "REST";
    }
}