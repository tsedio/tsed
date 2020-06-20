import {Injectable, Opts, UseOpts} from "@tsed/di";

@Injectable()
class MyConfigurableService {
  source: string;

  constructor(@Opts options: any = {}) {
    console.log("Hello ", options.source); // log: Hello Service1 then Hello Service2

    this.source = options.source;
  }
}

@Injectable()
class MyService1 {
  constructor(@UseOpts({source: "Service1"}) service: MyConfigurableService) {
    console.log(service.source); // log: Service1
  }
}

@Injectable()
class MyService2 {
  constructor(@UseOpts({source: "Service2"}) service: MyConfigurableService) {
    console.log(service.source); // log: Service2
  }
}
