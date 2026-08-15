import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {PlatformElysia} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformElysia,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("PlatformElysia integration", () => {
  describe.skip("Handlers (manually finalized responses are not supported)", () => utils.test("handlers"));
  describe("Children controllers", () => utils.test("childrenControllers"));
  describe("Inheritance controllers", () => utils.test("inheritanceController"));
  describe.skip("Response (Fetch response conversion is partial)", () => utils.test("response"));
  describe.skip("Stream (Node Readable streams are not Fetch response bodies)", () => utils.test("stream"));
  describe("Middlewares", () => utils.test("middlewares"));
  describe("Scope Request", () => utils.test("scopeRequest"));
  describe("Headers", () => utils.test("headers"));
  describe("AcceptMime", () => utils.test("acceptMime"));
  describe("HeaderParams", () => utils.test("headerParams"));
  describe.skip("PathParams (manually finalized response scenario is not supported)", () => utils.test("pathParams"));
  describe("QueryParams", () => utils.test("queryParams"));
  describe("BodyParams", () => utils.test("bodyParams"));
  describe("Cookies", () => utils.test("cookies"));
  describe.skip("Session (Elysia has no compatible session middleware)", () => utils.test("session"));
  describe("Location", () => utils.test("location"));
  describe.skip("Redirect (manual response completion is not supported)", () => utils.test("redirect"));
  describe("Errors", () => utils.test("errors"));
  describe.skip("ResponseFilters (Fetch content negotiation is not supported)", () => utils.test("responseFilter"));
  describe("Routing", () => utils.test("routing"));
  describe("Locals", () => utils.test("locals"));
  describe("Auth", () => utils.test("auth"));
  describe("Module", () => utils.test("module"));
  describe.skip("Cache (requires Node response cache semantics)", () => utils.test("cache"));

  describe.skip("Plugin: View (no Elysia view adapter)", () => utils.test("view"));
  describe("Plugin: Statics files", () => utils.test("statics"));
  describe.skip("Plugin: Multer (use Elysia native FormData instead)", () => utils.test("multer"));
  describe("Plugin: DeepQueryParams", () => utils.test("deepQueryParams"));
  describe("Plugin: Custom404", () => utils.test("custom404"));
});
