import {injectable} from "@tsed/di";

export default class MyModule {
  $onInit() {
    // The hook will be called once the module is loaded
  }
}

injectable(MyModule).configuration({
  imports: [
    // add your services here
  ]
});
