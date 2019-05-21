import {Controller, Get, ProviderScope, Scope, Req} from "@tsed/common";

@Controller("/")
@Scope(ProviderScope.REQUEST)
export class MyController {
  private rand = Math.random() * 100;

  @Get("/random")
  async getValue(@Req() req: Express.Request) {

    // Retrieve container
    const container = req.getContainer()

    return this.rand;
  }
}
