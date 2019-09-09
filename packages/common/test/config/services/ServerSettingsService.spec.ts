import {Env} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {$log} from "ts-log-debug";
import {ProviderScope, ProviderType} from "../../../../di/src/interfaces";
import {ServerSettingsService} from "../../../src/config/services/ServerSettingsService";

describe("ServerSettingsService", () => {
  let settings: any;

  describe("Test ENV", () => {
    before(() => {
      settings = new ServerSettingsService();

      Object.entries({
        rootDir: process.cwd(),
        env: (process.env.NODE_ENV as Env) || Env.DEV,
        port: 8080,
        httpPort: 8080,
        httpsPort: 8000,
        version: "1.0.0",
        uploadDir: "${rootDir}/uploads",
        scopes: {
          [ProviderType.CONTROLLER]: ProviderScope.SINGLETON
        },
        logger: {
          debug: false,
          level: "info",
          logRequest: true,
          jsonIndentation: process.env.NODE_ENV === Env.PROD ? 0 : 2
        },
        errors: {
          headerName: "errors"
        },
        mount: {
          "/rest": "${rootDir}/controllers/**/*.ts"
        },
        exclude: ["**/*.spec.ts", "**/*.spec.js"],
        componentsScan: ["${rootDir}/mvc/**/*.ts", "${rootDir}/services/**/*.ts", "${rootDir}/converters/**/*.ts"],
        controllerScope: ProviderScope.SINGLETON
      }).forEach(([key, value]) => {
        settings[key] = value;
      });

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
    });

    it("should return rootDir", () => {
      expect(settings.rootDir).to.equal(process.cwd());
    });
    it("should return rootDir", () => {
      expect(settings.rootDir).to.equal(process.cwd());
    });

    it("should return custom keys", () => {
      expect(settings.get("ownConfig")).to.equal("test");
    });

    it("should return env", () => {
      expect(settings.env).to.equal(Env.TEST);
    });

    it("should have logging jsonIndentaion set to 2", () => {
      expect(settings.logger.jsonIndentation).to.equal(2);
    });

    it("should return httpsPort", () => {
      expect(settings.httpsPort).to.equal(8000);
    });

    it("should return httpPort", () => {
      expect(settings.httpPort).to.equal(8080);
    });

    it("should return httpsPort", () => {
      expect(settings.getHttpsPort()).to.deep.equal({address: "0.0.0.0", port: 8000});
    });

    it("should return httpPort", () => {
      expect(settings.getHttpPort()).to.deep.equal({address: "0.0.0.0", port: 8080});
    });

    it("should return componentsScan", () => {
      expect(settings.componentsScan).to.be.an("array");
    });

    it("should return uploadDir", () => {
      expect(settings.uploadDir).to.contains("uploads");
    });

    it("should return mount", () => {
      expect(settings.mount["/rest"]).to.be.a("string");
    });

    it("should return httpsOptions", () => {
      expect((settings.httpsOptions as any).test).to.equal("/rest");
    });

    it("should return acceptMimes", () => {
      expect(settings.acceptMimes[0]).to.equal("application/json");
    });

    it("should return serveStatic", () => {
      expect(settings.statics).to.deep.equal({"/": "/publics"});
    });

    it("should return debug", () => {
      expect(settings.debug).to.equal(false);
    });

    it("should return debug (2)", () => {
      expect(settings.debug).to.equal(false);
    });

    it("should return env", () => {
      expect(settings.env).to.equal("test");
    });

    it("should return version", () => {
      expect(settings.version).to.equal("1.0.0");
    });

    it("should return errors", () => {
      expect(settings.errors).to.deep.equal({headerName: "errors"});
    });

    it("should return routers", () => {
      expect(settings.routers).to.deep.equal({mergeParams: true});
    });

    it("should return controllerScope", () => {
      expect(settings.controllerScope).to.equal("singleton");
    });

    it("should return excluded patterns", () => {
      expect(settings.exclude).to.deep.equal(["./**/*.spec.ts"]);
    });

    it("should return validationModelStrict", () => {
      expect(settings.validationModelStrict).to.equal(true);
      expect(settings.validationModelStrict).to.equal(true);

      settings.validationModelStrict = false;
      expect(settings.validationModelStrict).to.equal(false);
    });

    describe("forEach()", () => {
      it("should loop on items", () => {
        const result = [];
        settings.forEach((o: any) => result.push(o));
        expect(!!result.length).to.eq(true);
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

    describe("port", () => {
      it("should set port", () => {
        const settings = new ServerSettingsService();

        settings.set({port: 8081});

        expect(settings.httpPort).to.eq(8081);
        expect(settings.port).to.eq(8081);
      });
    });

    describe("resolve()", () => {
      it("should replace rootDir", () => {
        expect(settings.resolve("${rootDir}")).to.eq(process.cwd());
      });

      it("should replace rootDir", () => {
        expect(settings.resolve({other: null, resolve: "${rootDir}"})).to.deep.eq({
          other: null,
          resolve: process.cwd()
        });
      });

      it("should replace rootDir", () => {
        expect(settings.resolve({other: 808, resolve: "${rootDir}"})).to.deep.eq({
          other: 808,
          resolve: process.cwd()
        });
      });
    });
  });

  describe("Test PRODUCTION", () => {
    before(() => {
      process.env.NODE_ENV = "production";
      settings = new ServerSettingsService();
    });

    it("should return env PROD", () => {
      expect(settings.env).to.equal(Env.PROD);
    });

    it("should have logging jsonIndentaion set to 0", () => {
      expect(settings.logger.jsonIndentation).to.equal(0);
    });
  });

  describe("set logger format", () => {
    before(() => {
      settings = new ServerSettingsService();
      Sinon.stub($log.appenders, "set");

      settings.logger = {
        format: "format"
      };
    });

    after(() => {
      // @ts-ignore
      $log.appenders.set.restore();
    });

    it("should call $log.appenders.set()", () => {
      $log.appenders.set.should.have.been.calledWithExactly("stdout", {
        type: "stdout",
        levels: ["info", "debug"],
        layout: {
          type: "pattern",
          pattern: "format"
        }
      });

      $log.appenders.set.should.have.been.calledWithExactly("stderr", {
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
