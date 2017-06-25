import {All, Controller, Get, Render, RouteService} from "../../../src";
import SwaggerService from "../../../src/services/swagger";

@Controller("/rest")
export class RestCtrl {

    constructor(private routeService: RouteService, private swaggerService: SwaggerService) {

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

}