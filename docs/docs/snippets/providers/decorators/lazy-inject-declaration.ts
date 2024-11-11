import {Module} from "@tsed/di";

@Module({
  // works also with @Injectable
  imports: [] // Use the imports field if you have services to build
})
export default class MyModule {
  $onInit() {
    // The hook will be called once the module is loaded
  }
}
