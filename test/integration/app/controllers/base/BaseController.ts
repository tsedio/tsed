import {PathParams} from "../../../../../src/filters/decorators/pathParams";
import {Get} from "../../../../../src/mvc/decorators/method/route";
import {Description} from "../../../../../src/swagger/decorators/description";
import {Summary} from "../../../../../src/swagger/decorators/summary";

export class BaseController {

    constructor(protected entriesService: any) {
    }

    @Get("/:resources/test/:id")
    @Summary("Return an element by his resource")
    async getTest(@Description("The resource")
                  @PathParams("resources") resources: string,
                  @Description("Id of the resource")
                  @PathParams("id") id: string): Promise<any> {
        return {_id: id};
    }

    @Get("/list")
    @Summary("Return all elements from a service")
    async index(): Promise<any[]> {

        return [{_id: "test"}];
    }
}
