import {Env} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {$log} from "ts-log-debug";
import {ServerSettingsService} from "../../../src/config/services/ServerSettingsService";

describe("ServerSettingsService", () => {
  describe("Test ENV", () => {
    before(() => {
      const settings = new ServerSettingsService();
      settings.env = Env.TEST;

      settings.set("ownConfig", "test");
      settings.set({ownConfig2: "test"} as any);
      settings.version = "1.0.0";
      settings.httpsOptions = {test: "/rest"} as any;
      settings.acceptMimes = ["application/json"];
      settings.statics = {"/": "/publics"};
      settings.routers = {mergeParams: true};
      settings.exclude = ["./**/*.spec.ts"];
      settings.debug = true;

      this.settings = settings;
    });

    it("should return rootDir", () => {
      expect(this.settings.rootDir).to.equal(process.cwd());
    });
    it("should return rootDir", () => {
      expect(this.settings.rootDir).to.equal(process.cwd());
    });

    it("should return custom keys", () => {
      expect(this.settings.get("ownConfig")).to.equal("test");
    });

    it("should return env", () => {
      expect(this.settings.env).to.equal(Env.TEST);
    });

    it("should have logging jsonIndentaion set to 2", () => {
      expect(this.settings.logger.jsonIndentation).to.equal(2);
    });

    it("should return httpsPort", () => {
      expect(this.settings.httpsPort).to.equal(8000);
    });

    it("should return httpPort", () => {
      expect(this.settings.httpPort).to.equal(8080);
    });

    it("should return httpsPort", () => {
      expect(this.settings.getHttpsPort()).to.deep.equal({address: "0.0.0.0", port: 8000});
    });

    it("should return httpPort", () => {
      expect(this.settings.getHttpPort()).to.deep.equal({address: "0.0.0.0", port: 8080});
    });

    it("should return componentsScan", () => {
      expect(this.settings.componentsScan).to.be.an("array");
    });

    it("should return uploadDir", () => {
      expect(this.settings.uploadDir).to.contains("uploads");
    });

    it("should return mount", () => {
      expect(this.settings.mount["/rest"]).to.be.a("string");
    });

    it("should return httpsOptions", () => {
      expect((this.settings.httpsOptions as any).test).to.equal("/rest");
    });

    it("should return acceptMimes", () => {
      expect(this.settings.acceptMimes[0]).to.equal("application/json");
    });

    it("should return serveStatic", () => {
      expect(this.settings.statics).to.deep.equal({"/": "/publics"});
    });

    it("should return debug", () => {
      expect(this.settings.debug).to.equal(false);
    });

    it("should return debug (2)", () => {
      expect(this.settings.debug).to.equal(false);
    });

    it("should return env", () => {
      expect(this.settings.env).to.equal("test");
    });

    it("should return version", () => {
      expect(this.settings.version).to.equal("1.0.0");
    });

    it("should return errors", () => {
      expect(this.settings.errors).to.deep.equal({headerName: "errors"});
    });

    it("should return routers", () => {
      expect(this.settings.routers).to.deep.equal({mergeParams: true});
    });

    it("should return controllerScope", () => {
      expect(this.settings.controllerScope).to.equal("singleton");
    });

    it("should return excluded patterns", () => {
      expect(this.settings.exclude).to.deep.equal(["./**/*.spec.ts"]);
    });

    it("should return validationModelStrict", () => {
      expect(this.settings.validationModelStrict).to.equal(true);
      expect(this.settings.validationModelStrict).to.equal(true);

      this.settings.validationModelStrict = false;
      expect(this.settings.validationModelStrict).to.equal(false);
    });

    describe("forEach()", () => {
      before(() => {
        this.result = [];
        this.settings.forEach((o: any) => this.result.push(o));
      });

      it("should loop on items", () => {
        expect(!!this.result.length).to.eq(true);
      });
    });

    describe("buildAddressAndPort()", () => {
      it("should return address and port from a concatened address and port", () => {
        expect((ServerSettingsService as any).buildAddressAndPort("0.0.0.0:9000")).to.deep.eq({
          address: "0.0.0.0",
          port: 9000
        });
      });

      it("should return address and port from a port number", () => {
        expect((ServerSettingsService as any).buildAddressAndPort(9000)).to.deep.eq({
          address: "0.0.0.0",
          port: 9000
        });
      });
    });

    describe("resolve()", () => {
      it("should replace rootDir", () => {
        expect(this.settings.resolve("${rootDir}")).to.eq(process.cwd());
      });

      it("should replace rootDir", () => {
        expect(this.settings.resolve({other: null, resolve: "${rootDir}"})).to.deep.eq({
          other: null,
          resolve: process.cwd()
        });
      });

      it("should replace rootDir", () => {
        expect(this.settings.resolve({other: 808, resolve: "${rootDir}"})).to.deep.eq({
          other: 808,
          resolve: process.cwd()
        });
      });
    });
  });

  describe("Test PRODUCTION", () => {
    before(() => {
      process.env.NODE_ENV = "production";
      this.settings = new ServerSettingsService();
    });

    it("should return env PROD", () => {
      expect(this.settings.env).to.equal(Env.PROD);
    });

    it("should have logging jsonIndentaion set to 0", () => {
      expect(this.settings.logger.jsonIndentation).to.equal(0);
    });
  });

  describe("set logger format", () => {
    before(() => {
      const settings = new ServerSettingsService();
      this.appendersSetStub = Sinon.stub($log.appenders, "set");

      settings.logger = {
        format: "format"
      };

      this.settings = settings;
    });

    after(() => {
      this.appendersSetStub.restore();
    });

    it("should call $log.appenders.set()", () => {
      this.appendersSetStub.should.have.been.calledWithExactly("stdout", {
        type: "stdout",
        levels: ["info", "debug"],
        layout: {
          type: "pattern",
          pattern: "format"
        }
      });

      this.appendersSetStub.should.have.been.calledWithExactly("stderr", {
        levels: ["trace", "fatal", "error", "warn"],
        type: "stderr",
        layout: {
          type: "pattern",
          pattern: "format"
        }
      });
    });
  });
});
