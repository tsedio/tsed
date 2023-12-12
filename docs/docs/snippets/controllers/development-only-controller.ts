import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller({
  path: "local",
  environments: ["development"]
})
export class LocalCtrl {
  @Get()
  index(): string {
    return [];
  }
}
