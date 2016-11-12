
import {Service} from "../decorators/service";
import Controller from "../controllers/controller";
import {IControllerRoute} from "../interfaces/ControllerRoute";
import {$log} from "ts-log-debug";

/**
 * `RouteService` is used to provide all routes collected by annotation `@Controller`.
 */
@Service()
export default class RouteService {

    constructor() {

    }

    /**
     * Return all Routes stored in Controller manager.
     * @returns {IControllerRoute[]}
     */
    getAll(): IControllerRoute[] {
        return Controller.getRoutes();
    }

    /**
     * Print routes in console.
     */
    printRoutes(logger: {info: (s) => void} = $log) {
        return Controller.printRoutes(logger);
    }
}
