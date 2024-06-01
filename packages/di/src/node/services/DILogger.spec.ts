import {Logger} from "@tsed/logger";
import {Container, Inject, Injectable, InjectorService} from "../../common/index.js";

describe("DILogger", () => {
  it("should inject logger in another service", async () => {
    @Injectable()
    class MyService {
      @Inject()
      logger: Logger;
    }

    const injector = new InjectorService();
    injector.logger = new Logger();
    const container = new Container();
    container.add(MyService);

    await injector.load(container);
    const logger = injector.get(MyService).logger;

    expect(logger).toEqual(injector.logger);
  });
});
