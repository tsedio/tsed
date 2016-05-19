import {Controller, All, Next, Get, Response} from "../../index";
import * as Logger from "log-debug";

@Controller("/rest")
export class RestCtrl {
    
    @All('/')
    public all() {
        Logger.debug("Route ALL /rest");
    }
}