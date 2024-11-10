import {Inject, Injectable} from "@tsed/di";
import {CONNECTION} from "./connection.js";

@Injectable()
export class MyService {
  constructor(@Inject(CONNECTION) connection: CONNECTION) {}
}

