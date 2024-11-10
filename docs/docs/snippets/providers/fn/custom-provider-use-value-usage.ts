import {inject, injectable} from "@tsed/di";
import {CONNECTION} from "./connection.js";

export class MyService {
  readonly connection = inject(CONNECTION);
}

injectable(MyService);
