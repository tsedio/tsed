import {Scope, Service} from "@tsed/common";
import {$log} from "ts-log-debug";

@Service()
@Scope("request")
export class InnerService {
  private name = "innerService";

  constructor() {
    this.name = `innerService-random(${Math.ceil(Math.random() * 100)})`;
    $log.debug("InnerService New Instance");
  }

  read() {
    return this.name;
  }
}
