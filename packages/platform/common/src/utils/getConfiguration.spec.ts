import {Configuration} from "@tsed/di";
import {expect} from "chai";
import {getConfiguration} from "./getConfiguration";
import {Env} from "@tsed/core";

describe("getConfiguration()", () => {
  it("should load configuration for test", () => {
    @Configuration({})
    class App {}

    const config = getConfiguration({}, App);

    expect(config).to.deep.eq({
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

    expect(config).to.deep.eq({
      componentsScan: ["${rootDir}/mvc/**/*.ts", "${rootDir}/services/**/*.ts", "${rootDir}/middlewares/**/*.ts"],
      env: Env.PROD,
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

    expect(config).to.deep.eq({
      componentsScan: ["${rootDir}/mvc/**/*.ts", "${rootDir}/services/**/*.ts", "${rootDir}/middlewares/**/*.ts"],
      env: Env.PROD,
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

    const config = getConfiguration({}, App);

    expect(config).to.deep.eq({
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
