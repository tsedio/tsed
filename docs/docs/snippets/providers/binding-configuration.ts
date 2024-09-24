import {Env} from "@tsed/core";
import {Constant, Value} from "@tsed/di";

export class MyClass {
  @Constant("env")
  env: Env;

  @Value("swagger.path")
  swaggerPath: string;

  $onInit() {
    console.log(this.env);
  }
}
