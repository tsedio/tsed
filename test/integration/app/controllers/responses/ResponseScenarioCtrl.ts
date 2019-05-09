import {ContentType, Controller, Get, Next, PathParams, Post, Req, Res, Status} from "@tsed/common";
import {Docs, Hidden} from "@tsed/swagger";
import {createReadStream} from "fs";
import {join} from "path";
import {of} from "rxjs";


@Controller("/response")
@Hidden()
@Docs("responses")
export class ResponseScenarioCtrl {
  @Get("/scenario1/:id")
  public testScenario1Assert(@PathParams("id") id: number, @Req() request: Req) {
    request.ctx.test = "value";
  }

  @Get("/scenario1/:id")
  public testScenario1Get(@PathParams("id") id: number, @Req() request: Req) {
    return id + request.ctx.test;
  }


  @Get("/scenario2/:id")
  public testScenario2Assert(@PathParams("id") id: number, @Req() request: Req, @Next() next: Next) {
    setTimeout(() => {
      request.ctx.test = "value";
      next();
    }, 100);
  }

  @Get("/scenario2/:id")
  public testScenario2Get(@PathParams("id") id: number, @Req() request: Req) {
    return id + request.ctx.test;
  }

  @Post("/scenario3/:id?")
  @Status(204)
  public testScenario3EmptyResponse(@PathParams("id") id: number, @Res() response: Res) {
    if (id) {
      return;
    }

    response.status(201);

    return {
      "id": 1
    };
  }

  @Get("/scenario4/:id")
  async testScenario4Assert(@PathParams("id") id: number, @Req() request: Req, @Next() next: Next) {
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });

    request.ctx.test = "value";
    next();
  }

  @Get("/scenario4/:id")
  public testScenario4Get(@PathParams("id") id: number, @Req() request: Req) {
    return id + request.ctx.test;
  }

  @Get("/scenario5")
  async testScenario5Promise() {
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });

    return {
      "id": 1
    };
  }

  @Get("/scenario6")
  testScenario6Observable() {
    return of({"id": 1});
  }

  @Get("/scenario6b")
  async testScenario6bObservable() {
    return of({"id": 1});
  }

  @Get("/scenario7")
  @ContentType("application/json")
  testScenario7Stream() {
    return createReadStream(join(__dirname, "data/data.json"));
  }

  @Get("/scenario7b")
  @ContentType("application/json")
  async testScenario7bStream() {
    return createReadStream(join(__dirname, "data/data.json"));
  }

  @Get("/scenario8")
  testScenario8Middleware() {

    return (req: Req, res: Res, next: Next) => {
      res.json({"id": 1});
    };
  }

  @Get("/scenario8b")
  async testScenario8bMiddleware() {

    return (req: Req, res: Res, next: Next) => {
      res.json({"id": 1});
    };
  }

  @Get("/scenario9/static")
  public testScenario9Get(): string {
    return "value";
  }

  @Get("/scenario9/:id")
  public testScenario9WithDynamicParam(@PathParams("id") id: number): string {
    return "value" + id;
  }
}
