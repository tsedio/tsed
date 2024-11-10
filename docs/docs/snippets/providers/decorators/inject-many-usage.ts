import {Controller, Inject} from "@tsed/di";
import {Post} from "@tsed/schema";
import {BodyParams} from "@tsed/platform-params";

@Controller("/some")
export class SomeController {
  constructor(@Inject(Bar) private readonly bars: Bar[]) {}

  @Post()
  async create(@BodyParams("type") type: "baz" | "foo") {
    const bar: Bar | undefined = this.bars.find((x) => x.type === type);
  }
}
