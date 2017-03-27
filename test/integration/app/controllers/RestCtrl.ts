import {All, Controller, Get, Render, RouteService} from "../../../../src";

@Controller("/rest")
export class RestCtrl {

    constructor(private routeService: RouteService) {

    }

    @Get("/html")
    @Render("rest")
    public render() {
        return {endpoints: JSON.parse(JSON.stringify(this.routeService.getAll()))};
    }

    @All("/")
    public test(): Object {
        return this.routeService.getAll();
    }
}