import {Render, Controller, All, Get, RouteService} from "../../../src";

@Controller("/rest")
export class RestCtrl {

    constructor (
        private routeService: RouteService
    ) {

    }

    @All('/')
    public test(): Object {
        return this.routeService.getAll();
    }

    @Get('/html')
    @Render("rest")
    public render() {
        return {endpoints: JSON.parse(JSON.stringify(this.routeService.getAll()))};
    }
}