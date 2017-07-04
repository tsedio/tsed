import {Controller, Get, Render, RouteService} from "../../../../src";

@Controller("/rest")
export class RestCtrl {

    constructor(private routeService: RouteService) {

    }

    @Get("/html")
    @Render("rest")
    public render() {
        return {endpoints: JSON.parse(JSON.stringify(this.routeService.getAll()))};
    }
}