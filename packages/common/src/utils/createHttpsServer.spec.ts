import {createHttpsServer, HttpsServer, listenHttpsServer} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import {$log} from "@tsed/logger";
import {expect} from "chai";
import Sinon from "sinon";

describe("createHttpsServer", () => {
  it("should fork the create http server", () => {
    const injector = new InjectorService();

    createHttpsServer(injector);

    expect(!!injector.get(HttpsServer)).to.be.eq(true);
  });
  it("should listen the server", async () => {
    const injector = new InjectorService();
    injector.logger = $log;
    injector.logger.stop();
    // @ts-ignore
    injector.settings = {
      httpsPort: true,
      getHttpsPort: Sinon.stub().returns({address: "address", port: "port"}),
      setHttpsPort: Sinon.stub()
    };

    createHttpsServer(injector);

    const http = injector.get<HttpsServer>(HttpsServer)!;

    // @ts-ignore
    Sinon.stub(http, "on").callsFake((event, fn: any) => {
      // @ts-ignore
      if (event === "listening") {
        fn();
      }
    });
    Sinon.stub(http, "listen");
    // @ts-ignore
    Sinon.stub(http, "address").returns({port: 8080});

    const promise = listenHttpsServer(injector);

    expect(http.listen).to.have.been.calledWithExactly("port", "address");

    await promise;

    expect(injector.settings.setHttpsPort).to.have.been.calledWithExactly({address: "address", port: 8080});
  });
  it("should listen the server with port 0", async () => {
    const injector = new InjectorService();
    injector.logger = $log;
    injector.logger.stop();
    // @ts-ignore
    injector.settings = {
      httpsPort: 0,
      getHttpsPort: Sinon.stub().returns({address: "address", port: "port"}),
      setHttpsPort: Sinon.stub()
    };

    createHttpsServer(injector);

    const http = injector.get<HttpsServer>(HttpsServer)!;

    // @ts-ignore
    Sinon.stub(http, "on").callsFake((event, fn: any) => {
      // @ts-ignore
      if (event === "listening") {
        fn();
      }
    });
    Sinon.stub(http, "listen");
    // @ts-ignore
    Sinon.stub(http, "address").returns({port: 0});

    const promise = listenHttpsServer(injector);

    expect(http.listen).to.have.been.calledWithExactly("port", "address");

    await promise;

    expect(injector.settings.setHttpsPort).to.have.been.calledWithExactly({address: "address", port: 0});
  });
  it("should not listen the server when it's false", async () => {
    const injector = new InjectorService();
    injector.logger = $log;
    injector.logger.stop();
    // @ts-ignore
    injector.settings = {
      httpsPort: false
    };

    createHttpsServer(injector);

    const http = injector.get<HttpsServer>(HttpsServer)!;

    // @ts-ignore
    Sinon.stub(http, "on").callsFake((event, fn: any) => {
      // @ts-ignore
      if (event === "listening") {
        fn();
      }
    });
    Sinon.stub(http, "listen");
    // @ts-ignore
    Sinon.stub(http, "address").returns({port: 8080});

    await listenHttpsServer(injector);

    return expect(http.listen).to.not.have.been.called;
  });
});
