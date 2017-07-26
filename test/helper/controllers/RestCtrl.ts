import {All, Controller, Get, Render, RouteService} from "../../../src";
import {PathParams} from "../../../src/decorators";

@Controller("/rest")
export class RestCtrl {

    constructor(private routeService: RouteService) {

    }

    @All("/")
    public test(): Object {
        return this.routeService.getAll();
    }

    @Get("/html")
    @Render("rest")
    public render() {
        return {endpoints: JSON.parse(JSON.stringify(this.routeService.getAll()))};
    }

    @Get("/test")
    createConflict() {
        return "test";
    }

    @Get("/:id")
    createConflict2(@PathParams("id") id: number) {
        return "id";
    }
}