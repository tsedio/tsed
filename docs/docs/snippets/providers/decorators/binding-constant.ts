import {Env} from "@tsed/core";
import {Constant, Injectable} from "@tsed/di";

@Injectable()
export class MyClass {
  @Constant("env")
  private readonly env: Env;

  constructor() {
    console.log(this.env);
  }
}

// server.ts
import {Configuration} from "@tsed/di";

@Configuration({
  env: process.env.NODE_ENV
})
class Server {}
