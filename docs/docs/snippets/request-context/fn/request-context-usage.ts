import {context, controller, injectable} from "@tsed/di";
import {PlatformContext} from "@tsed/platform-http";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

export class CustomRepository {
  async findById(id: string) {
    const $ctx = context<PlatformContext>();
    $ctx?.logger.info("Where are in the repository");

    return {
      id,
      headers: $ctx?.request.headers
    };
  }
}

injectable(CustomRepository);

export class AsyncHookCtrl {
  private readonly repository = inject(CustomRepository);

  @Get("/:id")
  async get(@PathParams("id") id: string) {
    return this.repository.findById(id);
  }
}

controller(AsyncHookCtrl).path("/async-hooks");
