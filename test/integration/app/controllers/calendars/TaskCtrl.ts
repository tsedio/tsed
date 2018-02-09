import {PathParams, Authenticated, UseBefore, Controller, MergeParams, Get} from "@tsed/common";
import {Test2Middleware} from "../../middlewares/middleware";

@Controller("/:eventId/tasks")
@MergeParams()
@UseBefore(Test2Middleware)
@Authenticated({options: "options"})
export class TaskCtrl {

    @Get("/")
    async get(@PathParams("test") value: string, @PathParams("eventId") id: string) {
        return {value, id};
    }
}