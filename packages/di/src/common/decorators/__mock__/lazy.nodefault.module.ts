import {Injectable} from "../injectable.js";

@Injectable()
export default class MyLazyModule {
  called = false;
  $onInit() {
    this.called = true;
  }
}
