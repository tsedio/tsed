import {Injectable} from "../injectable.js";

@Injectable()
export class MyLazyModule {
  called = false;

  $onInit() {
    this.called = true;
  }
}

export default MyLazyModule;
