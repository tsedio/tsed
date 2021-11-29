import {InjectorService} from "@tsed/di";
import {HttpServer} from "../decorators/httpServer";
import {createHttpServer} from "./createHttpServer";
import {expect} from "chai";
import Sinon from "sinon";
import Http from "http";

describe("createHttpServer", () => {
  it("should create an instance of Http (http port true)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", true);

    const fn: any = Sinon.stub();

    const listener = createHttpServer(injector, fn);

    expect(!!injector.get(Http.Server)).to.be.eq(true);
    expect(!!injector.get(HttpServer)).to.be.eq(true);

    expect(listener).to.be.a("function");
  });

  it("should create a raw object (http port false)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", false);

    const fn: any = Sinon.stub();

    const listener = createHttpServer(injector, fn);

    expect(injector.get(Http.Server)).to.be.eq(null);
    expect(injector.get(HttpServer)).to.be.eq(null);

    expect(listener).to.eq(undefined);
  });

  it("should create an instance of Http (http port 0)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", 0);

    const fn: any = Sinon.stub();

    const listener = createHttpServer(injector, fn);

    expect(!!injector.get(Http.Server)).to.be.eq(true);
    expect(!!injector.get(HttpServer)).to.be.eq(true);

    expect(listener).to.be.a("function");
  });
  it("should create an instance of Http (http port + address)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", "0.0.0.0:8080");

    const fn: any = Sinon.stub();

    const listener = createHttpServer(injector, fn);

    expect(!!injector.get(Http.Server)).to.be.eq(true);
    expect(!!injector.get(HttpServer)).to.be.eq(true);

    expect(listener).to.be.a("function");
  });
});
