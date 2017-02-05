import {Controller, All, Get} from "../../../src/index";
import {MongooseService} from "../services/MongooseService";
import RouteService from "../../../src/services/route";
import {ResponseView} from "../../../src/decorators/response-view";

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
    @ResponseView("rest")
    public render() {
        return {endpoints: JSON.parse(JSON.stringify(this.routeService.getAll()))};
    }
}