import {Spec} from "@types/swagger-schema-official";
import {Service} from "../decorators/service";
import {IControllerRoute} from "../interfaces/ControllerRoute";
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
     * Return openAPISpec for routes stored in Controller manager.
     * @returns {Spec}
     */
    getOpenAPISpec(): Spec {
        return this.controllerService.getOpenAPISpec();
    }

    /**
     * Print routes in console.
     */
    printRoutes(logger: {info: (s) => void} = $log) {
        return this.controllerService.printRoutes(logger);
    }
}
