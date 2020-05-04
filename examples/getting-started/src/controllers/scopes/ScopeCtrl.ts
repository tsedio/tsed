import {Controller, Get, PathParams, Post, Res} from "@tsed/common";

@Controller("/scopes")
export class ScopeCtrl {
  @Get("/scenario1/:scope/:scopeId")
  async testScenario1(@PathParams("scope") scope: string) {
    // Here scope will be {0: 'a', 1: 'b', 2: 'c'} instead of 'abc' in version 5.47.0
    console.log(scope);

    return scope;
  }

  @Get("/scenario2/:scope/:scopeId")
  async testScenario2(@PathParams("scope") scope: any) {
    // This way it works in version 5.47.0
    console.log(scope);

    return scope;
  }

  @Post("/scenario3/:scope/:scopeId")
  async testScenario3(
    @PathParams("scope") scope: string
  ): Promise<any[]> {
    console.log(scope);

    // Here the function will return  {0: 'a', 1: 'b', 2: 'c'} instead of ['a','b','c']  in version 5.44.13
    return ["a", "b", "c"];
  }

  @Post("/scenario4/:scope/:scopeId")
  async testScenario4(
    @PathParams("scope") scope: string,
    @Res() response: any
  ): Promise<any[]> {
    console.log(scope);

    // This way it works  in version 5.44.13
    return response.json(["a", "b", "c"]);
  }
}
