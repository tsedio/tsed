import {PlatformExpress} from "@tsed/platform-express";
import {$log, BodyParams, Controller, PathParams, QueryParams} from "@tsed/platform-http";
import {DiscriminatorKey, DiscriminatorValue, Get, OneOf, Post, Property, Put, Required, Returns} from "@tsed/schema";

import {Hidden} from "../../src/index.js";
import {Server} from "./Server.js";

if (process.env.NODE_ENV !== "test") {
  class QueryModel {
    @Property()
    condition: string;

    @Property()
    value: string;
  }

  @Controller("/nested")
  class HelloWorld3 {
    @Get("/")
    get() {
      return {test: "Hello world"};
    }
  }

  @Controller({
    path: "/hello",
    children: [HelloWorld3]
  })
  class HelloWorld {
    @Get("/")
    get() {
      return {test: "Hello world"};
    }

    @Get("/hidden")
    @Hidden()
    getHidden() {
      return {test: "Hello world"};
    }

    @Get("/params")
    getQuery(@QueryParams("q") q: QueryModel) {
      return {test: "Hello world", q};
    }
  }

  @Controller("/hello2")
  @Hidden()
  class HelloWorld2 {
    @Get("/")
    get() {
      return {test: "Hello world"};
    }
  }

  class Event {
    @DiscriminatorKey() // declare this property a discriminator key
    type: string;

    @Property()
    value: string;
  }

  @DiscriminatorValue("page_view") // or @DiscriminatorValue() value can be inferred by the class name
  class PageView extends Event {
    @Required()
    url: string;
  }

  @DiscriminatorValue("action", "click_action")
  class Action extends Event {
    @Required()
    event: string;
  }

  @DiscriminatorValue()
  class CustomAction extends Event {
    @Required()
    event: string;

    @Property()
    meta: string;
  }

  type OneOfEvents = PageView | Action | CustomAction;

  @Controller("/one-of")
  class HelloOneOf {
    @Post("/")
    @(Returns(200, Array).OneOf(Event))
    post(@BodyParams() @OneOf(Event) events: OneOfEvents[]) {
      return [];
    }

    @Put("/:id")
    @(Returns(200).OneOf(Event))
    put(@PathParams(":id") id: string, @BodyParams() @OneOf(Event) event: OneOfEvents) {
      return [];
    }

    @Get("/:id")
    @(Returns(200).OneOf(Event))
    get(@PathParams(":id") id: string) {
      return [];
    }
  }

  async function bootstrap() {
    try {
      $log.debug("Start server...");
      const platform = await PlatformExpress.bootstrap(Server, {
        mount: {"/rest": [HelloWorld, HelloWorld2, HelloOneOf]}
      });

      await platform.listen();
      $log.debug("Server initialized");
    } catch (er) {
      console.error(er);
      $log.error(er);
    }
  }

  bootstrap();
}
