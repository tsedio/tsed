import {inject, injectable} from "@tsed/di";
import {CONNECTION} from "./connection.js";

export class MyService {
  private readonly connection = inject(CONNECTION);

  async getData() {
    // Demonstrate typical usage of the injected connection
    return this.connection.query("SELECT * FROM example");
  }
}

injectable(MyService);
