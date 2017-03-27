
import {Service} from "../decorators/class/service";
import {IControllerRoute} from "../interfaces";
import {$log} from "ts-log-debug";
import ControllerService from "./controller";

/**
 * `RouteService` is used to provide all routes collected by annotation `@Controller`.
 */
@Service()
export default class RouteService {

    constructor(private controllerService: ControllerService) {

    }

    /**
     * Return all Routes stored in Controller manager.
     * @returns {IControllerRoute[]}
     */
    getAll(): IControllerRoute[] {
        return this.controllerService.getRoutes();
    }

    /**
     * Print routes in console.
     */
    printRoutes(logger: {info: (s) => void} = $log) {
        return this.controllerService.printRoutes(logger);
    }
}
