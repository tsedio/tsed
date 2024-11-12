import {injectable} from "@tsed/di";

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

injectable(MyModule).configuration({
  imports: [
    // add your services here
    // Example: Import required services
    // AuthService,
    // UserService,
    // {
    //   token: 'CONFIG',
    //   use: {apiUrl: 'https://api.example.com'}
    // }
  ]
});
