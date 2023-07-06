import {Injectable} from "../injectable";

@Injectable()
export class MyLazyModule {
  called = false;
  $onInit() {
    this.called = true;
  }
}
