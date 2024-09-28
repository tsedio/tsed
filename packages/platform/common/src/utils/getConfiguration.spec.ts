import {Env} from "@tsed/core";
import {Configuration} from "@tsed/di";

import {getConfiguration} from "./getConfiguration.js";

class MyCtrl {}

describe("getConfiguration()", () => {
  it("should return configuration (2)", () => {
    @Configuration({
      mount: {
        "/v1": [MyCtrl]
      }
    })
    class MyModule {}

    expect(
      getConfiguration(
        {
          mount: {
            "/v2": [MyCtrl]
          }
        },
        MyModule
      )
    ).toEqual({
      $$resolved: true,
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

    const config = getConfiguration({}, App);

    expect(config).toEqual({
      $$resolved: true,
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

    const config = getConfiguration({}, App);

    expect(config).toEqual({
      $$resolved: true,
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

    const config = getConfiguration(
      {
        mount: {
          "/": [Ctrl]
        }
      },
      App
    );

    expect(config).toEqual({
      $$resolved: true,
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

    let config = getConfiguration({}, App);
    config = getConfiguration(config, App);

    expect(config).toEqual({
      $$resolved: true,
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
