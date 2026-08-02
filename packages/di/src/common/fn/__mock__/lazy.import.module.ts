import {injectable} from "../injectable.js";

class MyLazyModule {
  called = false;
  customCalled = false;

  $onInit() {
    this.called = true;
  }

  $onCustomEvent() {
    this.customCalled = true;
  }
}

export default injectable(MyLazyModule)
  .configuration({
    imports: []
  })
  .token();
