import {Inject, Injectable} from "@tsed/di";
import {CONNECTION} from "./connection.js";

@Injectable()
export class MyService {
  constructor(@Inject(CONNECTION) private connection: CONNECTION) {
  }

  async getData() {
    // Demonstrate typical usage of the injected connection
    return this.connection.query("SELECT * FROM example");
  }
}

