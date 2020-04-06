import {createHttpServer, listenHttpServer} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import {$log} from "@tsed/logger";
import {expect} from "chai";
import * as Sinon from "sinon";
import {HttpServer} from "../decorators/httpServer";

describe("createHttpServer", () => {
  it("should fork the create http server", () => {
    const injector = new InjectorService();

    createHttpServer(injector);

    expect(!!injector.get(HttpServer)).to.be.eq(true);
  });
  it("should listen the server", async () => {
    const injector = new InjectorService();
    injector.logger = $log;
    injector.logger.stop();
    // @ts-ignore
    injector.settings = {
      httpPort: true,
      getHttpPort: Sinon.stub().returns({address: "address", port: "port"}),
      setHttpPort: Sinon.stub()
    };

    createHttpServer(injector);

    const http = injector.get<HttpServer>(HttpServer)!;

    // @ts-ignore
    Sinon.stub(http, "on").callsFake((event, fn: any) => {
      if (event === "listening") {
        fn();
      }
    });
    Sinon.stub(http, "listen");
    // @ts-ignore
    Sinon.stub(http, "address").returns({port: 8080});

    const promise = listenHttpServer(injector);

    http.listen.should.have.been.calledWithExactly("port", "address");

    await promise;

    injector.settings.setHttpPort.should.have.been.calledWithExactly({address: "address", port: 8080});
  });
});
