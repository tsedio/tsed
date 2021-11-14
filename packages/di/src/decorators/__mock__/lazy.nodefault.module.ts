import {Injectable} from "@tsed/di";

@Injectable()
export class MyLazyModule {
  called = false;
  $onInit() {
    this.called = true;
  }
}
