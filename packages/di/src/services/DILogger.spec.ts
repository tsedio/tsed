import {Container, Inject, Injectable, InjectorService} from "@tsed/di";
import {Logger} from "@tsed/logger";

describe("DILogger", () => {
  it("should inject logger in another service", async () => {
    @Injectable()
    class MyService {
      @Inject()
      logger: Logger;
    }

    const injector = new InjectorService();
    const container = new Container();
    container.add(MyService);

    await injector.load(container);

    expect(injector.get(MyService).logger).toEqual(injector.logger);
  });
});
