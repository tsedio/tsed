import {Injectable, Controller, InjectContext} from "@tsed/di";
import {PlatformContext} from "@tsed/platform-http";

@Injectable()
export class CustomRepository {
  @InjectContext()
  protected $ctx?: PlatformContext;

  async findById(id: string) {
    this.ctx?.logger.info("Where are in the repository");

    return {
      id,
      headers: this.$ctx?.request.headers
    };
  }
}

@Controller("/async-hooks")
export class AsyncHookCtrl {
  @Inject()
  private readonly repository: CustomRepository;

  @Get("/:id")
  async get(@PathParams("id") id: string) {
    return this.repository.findById(id);
  }
}
