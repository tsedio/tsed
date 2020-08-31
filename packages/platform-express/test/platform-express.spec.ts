import {PlatformTestUtils} from "../../platform-test-utils/src";
import {PlatformExpress} from "../src";
import {rootDir, Server} from "./app/Server";

const utils = PlatformTestUtils.create({
  rootDir,
  platform: PlatformExpress,
  server: Server
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
  describe("Scope Request", () => {
    utils.test("scopeRequest");
  });
  describe("Headers", () => {
    utils.test("headers");
  });
  describe("Custom404", () => {
    utils.test("custom404");
  });
  describe("Statics files", () => {
    utils.test("statics");
  });
  describe("Cookies", () => {
    utils.test("cookies");
  });
  describe("Session", () => {
    utils.test("session");
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
  describe("Location", () => {
    utils.test("location");
  });
  describe("Redirect", () => {
    utils.test("redirect");
  });
  describe("View", () => {
    utils.test("view");
  });
  describe("Errors", () => {
    utils.test("errors");
  });
  describe("Response", () => {
    utils.test("response");
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
});
