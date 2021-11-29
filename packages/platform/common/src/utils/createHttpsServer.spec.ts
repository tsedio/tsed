import {InjectorService} from "@tsed/di";
import {HttpsServer} from "../decorators/httpsServer";
import {createHttpsServer} from "./createHttpsServer";
import {expect} from "chai";
import Sinon from "sinon";
import Https from "https";

const sandbox = Sinon.createSandbox();
describe("createHttpsServer", () => {
  afterEach(() => sandbox.restore());
  it("should create an instance of Https (Https port true)", async () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", true);

    const fn: any = Sinon.stub();

    const listener = createHttpsServer(injector, fn)!;

    expect(!!injector.get(Https.Server)).to.be.eq(true);
    expect(!!injector.get(HttpsServer)).to.be.eq(true);
    expect(listener).to.be.a("function");

    const server = injector.get(Https.Server);

    sandbox.stub(injector.logger, "info");
    sandbox.stub(injector.logger, "debug");
    sandbox.stub(server, "listen");
    sandbox.stub(server, "address").returns({port: 8089});
    sandbox.stub(server, "on").callsFake((event: string, cb: any) => {
      if (event === "listening") {
        cb();
      }
    });

    await listener();

    expect(server.listen).to.have.been.calledWithExactly(true, "0.0.0.0");
    expect(injector.logger.info).to.have.been.calledWithExactly("Listen server on https://0.0.0.0:8089");
  });

  it("should create a raw object (Https port false)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", false);

    const fn: any = Sinon.stub();

    const listener = createHttpsServer(injector, fn);

    expect(injector.get(Https.Server)).to.be.eq(null);
    expect(injector.get(HttpsServer)).to.be.eq(null);

    expect(listener).to.eq(undefined);
  });

  it("should create an instance of Https (https port 0)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", 0);

    const fn: any = Sinon.stub();

    const listener = createHttpsServer(injector, fn);

    expect(!!injector.get(Https.Server)).to.be.eq(true);
    expect(!!injector.get(HttpsServer)).to.be.eq(true);

    expect(listener).to.be.a("function");
  });
  it("should create an instance of Https (https port + address)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", "0.0.0.0:8080");

    const fn: any = Sinon.stub();

    const listener = createHttpsServer(injector, fn);

    expect(!!injector.get(Https.Server)).to.be.eq(true);
    expect(!!injector.get(HttpsServer)).to.be.eq(true);

    expect(listener).to.be.a("function");
  });
});
