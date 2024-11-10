import {Env} from "@tsed/core";
import {constant} from "@tsed/di";

export class MyClass {
  private readonly env = constant<Env>(Env);

  constructor() {
    console.log(this.env);
  }
}

injectable(MyClass);

// server.ts
import {configuration} from "@tsed/di";

class Server {}

configuration(Server, {
  env: process.env.NODE_ENV
})
