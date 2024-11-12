import {Module} from "@tsed/di";

@Module({
  // works also with @Injectable
  imports: [] // Use the imports field if you have services to build
})
export default class MyModule {
  private initialized: boolean = false;
  $onInit() {
    // This lifecycle hook is called after the module is loaded
    // and all dependencies are resolved.
    // Example: Initialize module-specific resources
    this.initialized = true;
    console.log("MyModule initialized!");
  }
}
