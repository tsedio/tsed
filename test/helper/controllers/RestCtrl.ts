import {Controller, All, Get} from "../../../src/index";
import {MongooseService} from "../services/MongooseService";
import RouteService from "../../../src/services/route";

@Controller("/rest")
export class RestCtrl {

    constructor(
        private mongooseService: MongooseService,
        private routeService: RouteService
    ) {

    }

    @All('/')
    public test() {
        return this.routeService.getAll();
    }
}