import {Scope, Service} from "@tsed/common";
import {$log} from "ts-log-debug";
import {InnerService} from "./InnerService";

@Service()
@Scope("request")
export class OuterService {
  constructor(public innerService: InnerService) {
    $log.debug("OuterService New Instance");
  }
}
