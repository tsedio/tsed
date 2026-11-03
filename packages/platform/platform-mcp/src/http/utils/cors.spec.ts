import {PlatformTest} from "@tsed/platform-http/testing";
import {cors, getCorsHeaders, MCP_CORS_ALLOWED_HEADERS, MCP_CORS_EXPOSED_HEADERS, preflight, setCorsHeaders} from "./cors.js";

function createContext(method = "POST", headers: Record<string, string> = {}) {
  return PlatformTest.createRequestContext({
    event: {
      request: PlatformTest.createRequest({method, headers})
    }
  });
}

describe("cors", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("getCorsHeaders()", () => {
    it.each([undefined, false])("returns nothing when CORS is disabled (%s)", (cors) => {
      expect(getCorsHeaders(cors, createContext())).toBeUndefined();
    });

    it("allows any origin with `true`", () => {
      expect(getCorsHeaders(true, createContext("POST", {origin: "https://app.example.com"}))).toEqual({
        "access-control-allow-origin": "*",
        "access-control-expose-headers": MCP_CORS_EXPOSED_HEADERS
      });
    });

    it("echoes an origin of the list", () => {
      expect(getCorsHeaders({origin: ["https://app.example.com"]}, createContext("POST", {origin: "https://app.example.com"}))).toEqual({
        "access-control-allow-origin": "https://app.example.com",
        "access-control-expose-headers": MCP_CORS_EXPOSED_HEADERS,
        vary: "Origin"
      });
    });

    it("does not allow an origin outside the list", () => {
      const headers = getCorsHeaders({origin: ["https://app.example.com"]}, createContext("POST", {origin: "https://evil.example.com"}));

      expect(headers).not.toHaveProperty("access-control-allow-origin");
      expect(headers).toMatchObject({vary: "Origin"});
    });

    it("adds the preflight headers to an OPTIONS request, allowing the requested headers", () => {
      const $ctx = createContext("OPTIONS", {origin: "https://app.example.com", "access-control-request-headers": "authorization"});

      expect(getCorsHeaders({maxAge: 60}, $ctx)).toMatchObject({
        "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
        "access-control-allow-headers": "authorization",
        "access-control-max-age": "60"
      });
    });

    it("allows the MCP headers by default in a preflight", () => {
      expect(getCorsHeaders(true, createContext("OPTIONS"))).toMatchObject({
        "access-control-allow-headers": MCP_CORS_ALLOWED_HEADERS,
        "access-control-max-age": "600"
      });
    });
  });

  describe("setCorsHeaders()", () => {
    it("sets the headers on the framework response and on the Node.js response", () => {
      const $ctx = createContext();
      const res = {setHeader: vi.fn()};

      vi.spyOn($ctx.response, "setHeaders").mockReturnThis();
      vi.spyOn($ctx, "getRes").mockReturnValue(res as never);

      setCorsHeaders(true, $ctx);

      expect($ctx.response.setHeaders).toHaveBeenCalledWith({
        "access-control-allow-origin": "*",
        "access-control-expose-headers": MCP_CORS_EXPOSED_HEADERS
      });
      expect(res.setHeader).toHaveBeenCalledWith("access-control-allow-origin", "*");
      expect(res.setHeader).toHaveBeenCalledWith("access-control-expose-headers", MCP_CORS_EXPOSED_HEADERS);
    });

    it("leaves the response untouched when CORS is disabled", () => {
      const $ctx = createContext();

      vi.spyOn($ctx.response, "setHeaders");

      setCorsHeaders(undefined, $ctx);

      expect($ctx.response.setHeaders).not.toHaveBeenCalled();
    });
  });

  describe("cors()", () => {
    it("returns a handler that sets the CORS headers of the given option on each context", () => {
      const handler = cors({origin: ["https://app.example.com"]});
      const $ctx = createContext("POST", {origin: "https://app.example.com"});

      vi.spyOn($ctx.response, "setHeaders").mockReturnThis();
      vi.spyOn($ctx, "getRes").mockReturnValue({setHeader: vi.fn()} as never);

      handler($ctx);

      expect($ctx.response.setHeaders).toHaveBeenCalledWith({
        "access-control-allow-origin": "https://app.example.com",
        "access-control-expose-headers": MCP_CORS_EXPOSED_HEADERS,
        vary: "Origin"
      });
    });

    it("returns a handler that leaves the response untouched when CORS is disabled", () => {
      const $ctx = createContext();

      vi.spyOn($ctx.response, "setHeaders");

      cors(undefined)($ctx);

      expect($ctx.response.setHeaders).not.toHaveBeenCalled();
    });
  });

  describe("preflight()", () => {
    it("answers 204 without body", () => {
      const $ctx = createContext("OPTIONS");
      const status = vi.spyOn($ctx.response, "status").mockReturnThis();
      const body = vi.spyOn($ctx.response, "body").mockReturnThis();

      expect(preflight($ctx)).toBe($ctx.response);
      expect(status).toHaveBeenCalledWith(204);
      expect(body).toHaveBeenCalledWith(undefined);
    });
  });
});
