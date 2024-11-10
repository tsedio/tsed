import {controller, injectMany} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";
import {Bar} from "./Bar.js"

export class SomeController {
  private readonly bars = injectMany<Bar>(Bar);

  @Post()
  async create(@BodyParams("type") type: "baz" | "foo") {
    const bar: Bar | undefined = this.bars.find((x) => x.type === type);
  }
}

controller(SomeController).path("/");
