import {Controller, All, Next, Get, Response} from "../../index";
import {$log} from "ts-log-debug";

@Controller("/rest")
export class RestCtrl {
    
    @All('/')
    public all() {
        $log.debug("Route ALL /rest");
        return "REST";
    }
}