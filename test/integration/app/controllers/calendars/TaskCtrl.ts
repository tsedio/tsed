import {PathParams} from "../../../../../src/filters/decorators/pathParams";
import {Controller} from "../../../../../src/mvc/decorators/class/controller";
import {MergeParams} from "../../../../../src/mvc/decorators/class/mergeParams";
import {Get} from "../../../../../src/mvc/decorators/method/route";
import {UseBefore} from "../../../../../src/mvc/decorators/method/useBefore";
import {Test2Middleware} from "../../middlewares/middleware";

@Controller("/:eventId/tasks")
@MergeParams()
@UseBefore(Test2Middleware)
export class TaskCtrl {

    @Get("/")
    async get(@PathParams("test") value: string, @PathParams("eventId") id: string) {
        return {value, id};
    }
}