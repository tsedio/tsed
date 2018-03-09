import {Controller, Get, PathParams} from "@tsed/common";
import {Hidden} from "../../../../../src/swagger";

@Controller("/hidden")
@Hidden()
export class HiddenCtrl {

    @Get("/")
    async get(@PathParams("test") value: string, @PathParams("eventId") id: string) {
        return {value, id};
    }
}