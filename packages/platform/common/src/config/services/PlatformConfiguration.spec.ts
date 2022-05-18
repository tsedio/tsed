import {Env} from "@tsed/core";
import {$log} from "@tsed/logger";
import {expect} from "chai";
import Sinon from "sinon";
import {ProviderScope, ProviderType} from "@tsed/di";
import {PlatformConfiguration} from "./PlatformConfiguration";

describe("PlatformConfiguration", () => {
  let settings: any;

  describe("Test ENV", () => {
    before(() => {
      settings = new PlatformConfiguration();

      Object.entries({
        rootDir: process.cwd(),
        env: (process.env.NODE_ENV as Env) || Env.DEV,
        port: 8080,
        httpPort: 8080,
        httpsPort: 8000,
        version: "1.0.0",
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
        mount: {},
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
      settings.statics = {"/": "/public"};
      settings.routers = {mergeParams: true};
      settings.exclude = ["./**/*.spec.ts"];
      settings.debug = true;
      settings.converter = {};

      settings.setHttpPort({address: "address", port: 8081});
      settings.setHttpsPort({address: "address", port: 8080});
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
      expect(settings.httpsPort).to.equal("address:8080");
    });

    it("should return httpPort", () => {
      expect(settings.httpPort).to.equal("address:8081");
    });

    it("should return httpsPort", () => {
      const info = settings.getHttpsPort();
      expect(info).to.deep.equal({
        protocol: "https",
        address: "address",
        port: 8080,
        toString: info.toString
      });
      expect(settings.getBestHost().toString()).to.equal("https://address:8080");
    });

    it("should return httpPort", () => {
      const info = settings.getHttpPort();
      expect(info).to.deep.equal({
        protocol: "http",
        address: "address",
        port: 8081,
        toString: info.toString
      });
      expect(settings.getBestHost().toString()).to.equal("https://address:8080");
    });

    it("should return httpsOptions", () => {
      expect((settings.httpsOptions as any).test).to.equal("/rest");
    });

    it("should return acceptMimes", () => {
      expect(settings.acceptMimes[0]).to.equal("application/json");
    });

    it("should return statics", () => {
      expect(settings.statics).to.deep.equal({"/": "/public"});
    });

    describe("debug", () => {
      it("should expose debug as initialized", () => {
        expect(settings.debug).to.equal(true);
      });

      it("debug should be equal to the last set value", () => {
        settings.debug = false;
        expect(settings.debug).to.equal(false);
      });
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

    it("should return converter settings", () => {
      expect(settings.converter).to.deep.equal({});
    });

    it("should return controllerScope", () => {
      expect(settings.controllerScope).to.equal("singleton");
    });

    it("should return excluded patterns", () => {
      expect(settings.exclude).to.deep.equal(["./**/*.spec.ts"]);
    });

    describe("forEach()", () => {
      it("should loop on items", () => {
        const result = [];
        settings.forEach((o: any) => result.push(o));
        expect(!!result.length).to.eq(true);
      });
    });

    describe("port", () => {
      it("should set port", () => {
        const settings = new PlatformConfiguration();

        settings.set({port: 8081});

        expect(settings.httpPort).to.eq(8081);
        expect(settings.port).to.eq(8081);
      });
    });
  });
});
