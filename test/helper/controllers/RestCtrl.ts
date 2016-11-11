import {Controller, All, Next, Get, Response} from "../../../index";
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