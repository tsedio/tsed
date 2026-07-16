import {Configuration} from "@tsed/di";
import {Env} from "@tsed/core";
import {defineConfiguration} from "./defineConfiguration.js";

class MyCtrl {}

describe("getConfiguration()", () => {
  describe("configuration initialization", () => {
    it("should return configuration (2)", () => {
      @Configuration({
        mount: {
          "/v1": [MyCtrl]
        }
      })
      class MyModule {}

      expect(
        defineConfiguration({
          rootModule: MyModule,
          mount: {
            "/v2": [MyCtrl]
          }
        })
      ).toEqual({
        $$resolved: true,
        rootModule: MyModule,
        rootDir: process.cwd(),
        jsonMapper: {
          additionalProperties: false,
          disableUnsecureConstructor: true,
          strictGroups: false
        },
        env: "test",
        httpPort: 8080,
        httpsPort: false,
        logger: {
          debug: false,
          jsonIndentation: 2,
          level: "off",
          logRequest: true
        },
        mount: {
          "/v1": [MyCtrl],
          "/v2": [MyCtrl]
        },
        scopes: {
          controller: "singleton"
        }
      });
    });
    it("should load configuration for test", () => {
      @Configuration({})
      class App {}

      const config = defineConfiguration({rootModule: App});

      expect(config).toEqual({
        $$resolved: true,
        rootModule: App,
        rootDir: process.cwd(),
        jsonMapper: {
          additionalProperties: false,
          disableUnsecureConstructor: true,
          strictGroups: false
        },
        env: "test",
        httpPort: 8080,
        httpsPort: false,
        logger: {
          debug: false,
          jsonIndentation: 2,
          level: "off",
          logRequest: true
        },
        mount: {},
        scopes: {
          controller: "singleton"
        }
      });
    });
    it("should load configuration for production", () => {
      @Configuration({
        env: Env.PROD
      })
      class App {}

      const config = defineConfiguration({rootModule: App});

      expect(config).toEqual({
        $$resolved: true,
        rootModule: App,
        rootDir: process.cwd(),
        jsonMapper: {
          additionalProperties: false,
          disableUnsecureConstructor: true,
          strictGroups: false
        },
        env: Env.PROD,
        httpPort: 8080,
        httpsPort: false,
        logger: {
          debug: false,
          jsonIndentation: 2,
          level: "info",
          logRequest: true
        },
        mount: {},
        scopes: {
          controller: "singleton"
        }
      });
    });
    it("should load configuration with mount from config", () => {
      @Configuration({
        env: Env.PROD
      })
      class App {}

      class Ctrl {}

      const config = defineConfiguration({
        rootModule: App,
        mount: {
          "/": [Ctrl]
        }
      });

      expect(config).toEqual({
        $$resolved: true,
        rootModule: App,
        rootDir: process.cwd(),
        jsonMapper: {
          additionalProperties: false,
          disableUnsecureConstructor: true,
          strictGroups: false
        },
        env: Env.PROD,
        httpPort: 8080,
        httpsPort: false,
        logger: {
          debug: false,
          jsonIndentation: 2,
          level: "info",
          logRequest: true
        },
        mount: {
          "/": [Ctrl]
        },
        scopes: {
          controller: "singleton"
        }
      });
    });
    it("should load configuration with mount from decorator", () => {
      class Ctrl {}

      @Configuration({
        env: Env.PROD,
        mount: {
          "/": [Ctrl]
        }
      })
      class App {}

      let config = defineConfiguration({rootModule: App});
      config = defineConfiguration({
        ...config,
        rootModule: App
      });

      expect(config).toEqual({
        $$resolved: true,
        rootModule: App,
        rootDir: process.cwd(),
        jsonMapper: {
          additionalProperties: false,
          disableUnsecureConstructor: true,
          strictGroups: false
        },
        env: Env.PROD,
        httpPort: 8080,
        httpsPort: false,
        logger: {
          debug: false,
          jsonIndentation: 2,
          level: "info",
          logRequest: true
        },
        mount: {
          "/": [Ctrl]
        },
        scopes: {
          controller: "singleton"
        }
      });
    });
  });
});
