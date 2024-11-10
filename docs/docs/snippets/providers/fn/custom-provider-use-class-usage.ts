import {inject, injectable} from "@tsed/di";
import {ConfigService} from "./ConfigService";

export class MyService {
  constructor() {
    console.log(process.env.NODE_ENV, inject(ConfigService)); // DevConfigService or ConfigService
  }
}

injectable(MyService)
