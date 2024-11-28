import {PlatformTestSdk} from "@tsed/platform-test-sdk";

import {PlatformExpress} from "../src/components/PlatformExpress.js";
import {rootDir, Server} from "./app/Server.js";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("PlatformExpress", () => {
  describe("Handlers", () => {
    utils.test("handlers");
  });
  describe("Children controllers", () => {
    utils.test("childrenControllers");
  });
  describe("Inheritance controllers", () => {
    utils.test("inheritanceController");
  });
  describe("Response", () => {
    utils.test("response");
  });
  describe("Stream", () => {
    utils.test("stream");
  });
  describe("Middlewares", () => {
    utils.test("middlewares");
  });
  describe("Scope Request", () => {
    utils.test("scopeRequest");
  });
  describe("Headers", () => {
    utils.test("headers");
  });
  describe("AcceptMime", () => {
    utils.test("acceptMime");
  });
  describe("HeaderParams", () => {
    utils.test("headerParams");
  });
  describe("PathParams", () => {
    utils.test("pathParams");
  });
  describe("QueryParams", () => {
    utils.test("queryParams");
  });
  describe("BodyParams", () => {
    utils.test("bodyParams");
  });
  describe("Cookies", () => {
    utils.test("cookies");
  });
  describe("Session", () => {
    utils.test("session");
  });
  describe("Location", () => {
    utils.test("location");
  });
  describe("Redirect", () => {
    utils.test("redirect");
  });
  describe("Errors", () => {
    utils.test("errors");
  });
  describe("ResponseFilters", () => {
    utils.test("responseFilter");
  });
  describe("Routing", () => {
    utils.test("routing");
  });
  describe("Locals", () => {
    utils.test("locals");
  });
  describe("Auth", () => {
    utils.test("auth");
  });
  describe("Module", () => {
    utils.test("module");
  });
  describe("Cache", () => {
    utils.test("cache");
  });
  // EXTRA
  describe("Plugin: View", () => {
    utils.test("view");
  });
  describe("Plugin: Statics files", () => {
    utils.test("statics");
  });
  describe("Plugin: Multer", () => {
    utils.test("multer");
  });
  describe("Plugin: DeepQueryParams", () => {
    utils.test("deepQueryParams");
  });
  describe("Plugin: Custom404", () => {
    utils.test("custom404");
  });
});
