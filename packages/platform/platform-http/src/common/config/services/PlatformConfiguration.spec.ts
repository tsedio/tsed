import {Env} from "@tsed/core";
import {ProviderScope, ProviderType} from "@tsed/di";

import {PlatformConfiguration} from "./PlatformConfiguration.js";

describe("PlatformConfiguration", () => {
  let settings: any;

  describe("Test ENV", () => {
    beforeAll(() => {
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
      //settings.jsonMapper = {};

      settings.setHttpPort({address: "address", port: 8081});
      settings.setHttpsPort({address: "address", port: 8080});
    });

    it("should return rootDir", () => {
      expect(settings.rootDir).toEqual(process.cwd());
    });

    it("should return custom keys", () => {
      expect(settings.get("ownConfig")).toEqual("test");
    });

    it("should return env", () => {
      expect(settings.env).toEqual(Env.TEST);
    });

    it("should have logging jsonIndentaion set to 2", () => {
      expect(settings.logger.jsonIndentation).toEqual(2);
    });

    it("should return httpsPort", () => {
      expect(settings.httpsPort).toEqual("address:8080");
    });

    it("should return httpPort", () => {
      expect(settings.httpPort).toEqual("address:8081");
    });

    it("should return the best host", () => {
      const info = settings.getHttpsPort();
      expect(info).toEqual({
        protocol: "https",
        address: "address",
        port: 8080,
        toString: info.toString
      });
      expect(settings.getBestHost().toString()).toEqual("https://address:8080");
    });

    it("should return httpPort multiple usecase", () => {
      const info = settings.getHttpPort();
      expect(info).toEqual({
        protocol: "http",
        address: "address",
        port: 8081,
        toString: info.toString
      });
      expect(settings.getBestHost().toString()).toEqual("https://address:8080");

      settings.set("httpsPort", false);
      expect(settings.getBestHost().toString()).toEqual("http://address:8081");

      settings.set("httpPort", false);
      expect(settings.getBestHost().toString()).toEqual("/");
    });

    it("should return httpsOptions", () => {
      expect((settings.httpsOptions as any).test).toEqual("/rest");
    });

    it("should return acceptMimes", () => {
      expect(settings.acceptMimes[0]).toEqual("application/json");
    });

    it("should return statics", () => {
      expect(settings.statics).toEqual({"/": "/public"});
    });

    describe("debug", () => {
      it("should expose debug as initialized", () => {
        expect(settings.debug).toEqual(true);
      });

      it("debug should be equal to the last set value", () => {
        settings.debug = false;
        expect(settings.debug).toEqual(false);
      });
    });

    it("should return additionalProperties", () => {
      expect(settings.additionalProperties).toEqual(false);
    });

    it("should return version", () => {
      expect(settings.version).toEqual("1.0.0");
    });

    it("should return errors", () => {
      expect(settings.errors).toEqual({headerName: "errors"});
    });

    it("should return routers", () => {
      expect(settings.routers).toEqual({mergeParams: true});
    });

    it("should return jsonMapper settings", () => {
      expect(settings.jsonMapper).toEqual({
        disableUnsecureConstructor: true,
        additionalProperties: false,
        strictGroups: false
      });
    });

    it("should return controllerScope", () => {
      expect(settings.controllerScope).toEqual("singleton");
    });

    it("should return excluded patterns", () => {
      expect(settings.exclude).toEqual(["./**/*.spec.ts"]);
    });

    describe("forEach()", () => {
      it("should loop on items", () => {
        const result = [];
        settings.forEach((o: any) => result.push(o));
        expect(!!result.length).toEqual(true);
      });
    });

    describe("port", () => {
      it("should set port", () => {
        const settings = new PlatformConfiguration();

        settings.set({port: 8081});

        expect(settings.httpPort).toEqual(8081);
        expect(settings.port).toEqual(8081);
      });
    });
  });
});
