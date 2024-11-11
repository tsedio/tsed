import {injectable} from "../injectable.js";

class MyLazyModule {
  called = false;

  $onInit() {
    this.called = true;
  }
}

export default injectable(MyLazyModule)
  .configuration({
    imports: []
  })
  .token();
