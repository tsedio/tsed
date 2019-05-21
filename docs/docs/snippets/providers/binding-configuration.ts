import {Constant, Value} from "@tsed/di";
import {Env} from "@tsed/core";

export class MyClass {
  @Constant("env")
  env: Env;

  @Value("swagger.path")
  swaggerPath: string;

  $onInit() {
    console.log(this.env);
  }
}
