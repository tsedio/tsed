import {$log, Scope, Service} from "@tsed/common";
import {InnerService} from "./InnerService";

@Service()
@Scope("request")
export class OuterService {
  constructor(public innerService: InnerService) {
    $log.debug("OuterService New Instance");
  }
}
