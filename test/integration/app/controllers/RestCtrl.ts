import {Controller, ExpressRouter, Get, PathParams, QueryParams, Render, RouteService} from "@tsed/common";
import {Returns, Summary} from "@tsed/swagger";

@Controller("/rest")
export class RestCtrl {

    constructor(private routeService: RouteService, @ExpressRouter private router: ExpressRouter) {
        /*router.get(/(test)/, (res, req) => {

        });*/
    }

    @Get("/html")
    @Render("rest")
    public render() {
        return {endpoints: JSON.parse(JSON.stringify(this.routeService.getAll()))};
    }
}