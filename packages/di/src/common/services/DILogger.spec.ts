import {Container, Inject, Injectable, InjectorService, LOGGER} from "../../common/index.js";

describe("DILogger", () => {
  it("should inject logger in another service", async () => {
    @Injectable()
    class MyService {
      @Inject(LOGGER)
      logger: LOGGER;
    }

    const injector = new InjectorService();
    injector.logger = console;

    const container = new Container();
    container.add(MyService);

    await injector.load(container);
    const logger = injector.get(MyService)!.logger;

    expect(logger).toEqual(injector.logger);
  });
});
