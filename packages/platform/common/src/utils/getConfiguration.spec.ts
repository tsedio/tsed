import {Configuration} from "@tsed/di";
import {getConfiguration} from "./getConfiguration";
import {Env} from "@tsed/core";

describe("getConfiguration()", () => {
  it("should return configuration (2)", () => {
    @Configuration({
      mount: {
        "/v1": ["/root1/*.ts"]
      },
      componentsScan: ["/root1-services/*.ts"]
    })
    class MyModule {}

    expect(
      getConfiguration(
        {
          mount: {
            "/v2": ["/root2/*.ts"]
          },
          componentsScan: ["/root2-services/*.ts"]
        },
        MyModule
      )
    ).toEqual({
      $$resolved: true,
      componentsScan: ["/root1-services/*.ts", "/root2-services/*.ts"],
      env: "test",
      exclude: ["**/*.spec.ts", "**/*.spec.js"],
      httpPort: 8080,
      httpsPort: false,
      logger: {
        debug: false,
        jsonIndentation: 2,
        level: "off",
        logRequest: true
      },
      mount: {
        "/v1": ["/root1/*.ts"],
        "/v2": ["/root2/*.ts"]
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
      componentsScan: ["${rootDir}/mvc/**/*.ts", "${rootDir}/services/**/*.ts", "${rootDir}/middlewares/**/*.ts"],
      env: "test",
      exclude: ["**/*.spec.ts", "**/*.spec.js"],
      httpPort: 8080,
      httpsPort: false,
      logger: {
        debug: false,
        jsonIndentation: 2,
        level: "off",
        logRequest: true
      },
      mount: {
        "/rest": "${rootDir}/controllers/**/*.ts"
      },
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
      componentsScan: ["${rootDir}/mvc/**/*.ts", "${rootDir}/services/**/*.ts", "${rootDir}/middlewares/**/*.ts"],
      env: Env.PROD,
      exclude: ["**/*.spec.ts", "**/*.spec.js"],
      httpPort: 8080,
      httpsPort: false,
      logger: {
        debug: false,
        jsonIndentation: 2,
        level: "info",
        logRequest: true
      },
      mount: {
        "/rest": "${rootDir}/controllers/**/*.ts"
      },
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
      componentsScan: ["${rootDir}/mvc/**/*.ts", "${rootDir}/services/**/*.ts", "${rootDir}/middlewares/**/*.ts"],
      env: Env.PROD,
      exclude: ["**/*.spec.ts", "**/*.spec.js"],
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
      componentsScan: ["${rootDir}/mvc/**/*.ts", "${rootDir}/services/**/*.ts", "${rootDir}/middlewares/**/*.ts"],
      env: Env.PROD,
      exclude: ["**/*.spec.ts", "**/*.spec.js"],
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
