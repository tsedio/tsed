import type {AuthInfo} from "@modelcontextprotocol/server";
import {inject, logger} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import type {PlatformMcpAuthSettings} from "../../common/interfaces/PlatformMcpAuthSettings.js";
import {PlatformTokenVerifier} from "../../common/domain/PlatformTokenVerifier.js";
import {PlatformMcpAuthService} from "./PlatformMcpAuthService.js";

const authInfo: AuthInfo = {
  token: "valid",
  clientId: "client",
  scopes: ["mcp:read"],
  expiresAt: Math.floor(Date.now() / 1000) + 3600
};

function createAuth(opts: Partial<PlatformMcpAuthSettings> = {}): PlatformMcpAuthSettings {
  return {issuer: "https://auth.example.com", resource: "https://api.example.com/mcp", ...opts};
}

function createContext(headers: Record<string, string> = {}) {
  return PlatformTest.createRequestContext({
    event: {
      request: PlatformTest.createRequest({protocol: "https", headers: {host: "gateway.example.com", ...headers}})
    }
  });
}

describe("PlatformMcpAuthService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => {
    vi.restoreAllMocks();

    return PlatformTest.reset();
  });

  describe("getVerifier()", () => {
    it("creates one verifier per auth configuration", () => {
      const service = inject(PlatformMcpAuthService);
      const auth = createAuth();
      const resource = new URL(auth.resource!);

      const verifier = service.getVerifier(auth, resource);

      expect(verifier).toBeInstanceOf(PlatformTokenVerifier);
      expect(service.getVerifier(auth, resource)).toBe(verifier);
      expect(service.getVerifier(createAuth(), resource)).not.toBe(verifier);
    });
  });

  describe("getProtectedResourceMetadataPath()", () => {
    it("suffixes the well-known path with the endpoint path", () => {
      const service = inject(PlatformMcpAuthService);

      expect(service.getProtectedResourceMetadataPath("/mcp/directus")).toBe("/.well-known/oauth-protected-resource/mcp/directus");
      expect(service.getProtectedResourceMetadataPath("/")).toBe("/.well-known/oauth-protected-resource");
    });
  });

  describe("getResourceUrl()", () => {
    it("returns the configured resource", () => {
      const service = inject(PlatformMcpAuthService);

      expect(service.getResourceUrl(createAuth()).href).toBe("https://api.example.com/mcp");
    });
  });

  describe("getProtectedResourceMetadata()", () => {
    it("advertises the resource and its authorization server", () => {
      const service = inject(PlatformMcpAuthService);
      const auth = createAuth({
        scopesSupported: ["mcp:read", "mcp:write"],
        resourceName: "Orders MCP",
        resourceDocumentation: "https://docs.example.com/mcp"
      });

      expect(service.getProtectedResourceMetadata(auth, new URL(auth.resource!))).toEqual({
        resource: "https://api.example.com/mcp",
        authorization_servers: ["https://auth.example.com"],
        scopes_supported: ["mcp:read", "mcp:write"],
        resource_name: "Orders MCP",
        resource_documentation: "https://docs.example.com/mcp"
      });
    });

    it("refuses a non-HTTPS issuer unless insecure requests are allowed", () => {
      const service = inject(PlatformMcpAuthService);
      const resource = new URL("https://api.example.com/mcp");

      expect(() => service.getProtectedResourceMetadata(createAuth({issuer: "http://auth.example.com"}), resource)).toThrow(
        "Issuer URL must be HTTPS"
      );
      expect(
        service.getProtectedResourceMetadata(createAuth({issuer: "http://auth.example.com", allowInsecureRequests: true}), resource)
      ).toMatchObject({authorization_servers: ["http://auth.example.com"]});
      expect(service.getProtectedResourceMetadata(createAuth({issuer: "http://localhost:3000"}), resource)).toMatchObject({
        authorization_servers: ["http://localhost:3000"]
      });
    });
  });

  describe("validate()", () => {
    const verifier = {verifyAccessToken: vi.fn()};

    it.each([
      ["the introspection mode requires auth.clientId and auth.clientSecret", {mode: "introspection"}],
      ["the introspection mode requires auth.clientId and auth.clientSecret", {clientId: "gateway"}],
      ["auth.audience cannot be disabled in offline mode", {audience: false}],
      ["auth.resource is required", {resource: undefined}],
      ["auth.resource is required", {resource: undefined, audience: "mcp"}],
      ["auth.resource is required", {resource: undefined, verifier}],
      ["auth.issuer must be an absolute URL", {issuer: "auth.example.com"}],
      ["auth.resource must be an absolute URL", {resource: "/mcp"}],
      ["invalid auth configuration. Issuer URL must be HTTPS", {issuer: "http://auth.example.com"}],
      ["invalid auth configuration.", {resourceDocumentation: "not a url"}]
    ] as [string, Partial<PlatformMcpAuthSettings>][])("throws when %s (%j)", (message, opts) => {
      const service = inject(PlatformMcpAuthService);

      expect(() => service.validate("/mcp", createAuth(opts))).toThrow(`MCP endpoint "/mcp": ${message}`);
    });

    it.each([
      ["offline mode with a resource", {}],
      ["offline mode with a custom audience", {audience: "mcp"}],
      ["introspection mode with client credentials", {clientId: "gateway", clientSecret: "secret"}],
      ["a custom verifier", {verifier}],
      ["a custom verifier in introspection mode without credentials", {mode: "introspection", verifier}]
    ] as [string, Partial<PlatformMcpAuthSettings>][])("accepts %s", (_, opts) => {
      const service = inject(PlatformMcpAuthService);

      expect(() => service.validate("/mcp", createAuth(opts))).not.toThrow();
    });

    it("warns when the audience check is disabled in introspection mode", () => {
      const service = inject(PlatformMcpAuthService);
      vi.spyOn(logger(), "warn").mockReturnValue(undefined as never);

      service.validate("/mcp", createAuth({clientId: "gateway", clientSecret: "secret", audience: false}));

      expect(logger().warn).toHaveBeenCalledWith(
        expect.objectContaining({event: "MCP_AUTH_AUDIENCE_DISABLED", message: expect.stringContaining('"/mcp"')})
      );
    });

    it("does not warn when a custom verifier owns the audience check", () => {
      const service = inject(PlatformMcpAuthService);
      vi.spyOn(logger(), "warn").mockReturnValue(undefined as never);

      service.validate("/mcp", createAuth({audience: false, verifier}));

      expect(logger().warn).not.toHaveBeenCalled();
    });
  });

  describe("verifyMcpRequest()", () => {
    function createVerifier() {
      return {
        verifyAccessToken: vi.fn(async (token: string): Promise<AuthInfo> => {
          if (token !== "valid") {
            throw new Error("Unknown token");
          }

          return authInfo;
        })
      };
    }

    it("returns the verified identity", async () => {
      const service = inject(PlatformMcpAuthService);
      const verifier = createVerifier();

      const result = await service.verifyMcpRequest(createAuth({verifier}), createContext({authorization: "Bearer valid"}));

      expect(result).toEqual(authInfo);
      expect(verifier.verifyAccessToken).toHaveBeenCalledExactlyOnceWith("valid");
    });

    it("challenges a request without token and points to the resource metadata", async () => {
      const service = inject(PlatformMcpAuthService);
      const verifier = createVerifier();

      const result = (await service.verifyMcpRequest(createAuth({verifier}), createContext())) as Response;

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(401);
      expect(result.headers.get("www-authenticate")).toContain(
        'resource_metadata="https://api.example.com/.well-known/oauth-protected-resource/mcp"'
      );
      expect(verifier.verifyAccessToken).not.toHaveBeenCalled();
    });

    it("challenges a request with an invalid token without leaking the verifier error", async () => {
      const service = inject(PlatformMcpAuthService);

      const result = (await service.verifyMcpRequest(
        createAuth({verifier: createVerifier()}),
        createContext({authorization: "Bearer nope"})
      )) as Response;

      expect(result.status).toBe(401);
      expect(result.headers.get("www-authenticate")).toContain('error="invalid_token"');
      expect(await result.text()).not.toContain("Unknown token");
    });

    it("rejects a token lacking a required scope", async () => {
      const service = inject(PlatformMcpAuthService);
      const auth = createAuth({verifier: createVerifier(), requiredScopes: ["mcp:write"]});

      const result = (await service.verifyMcpRequest(auth, createContext({authorization: "Bearer valid"}))) as Response;

      expect(result.status).toBe(403);
      expect(result.headers.get("www-authenticate")).toContain('error="insufficient_scope"');
      expect(result.headers.get("www-authenticate")).toContain('scope="mcp:write"');
    });

    it("ignores the Host header of the request in the challenge", async () => {
      const service = inject(PlatformMcpAuthService);
      const auth = createAuth({verifier: createVerifier()});

      const result = (await service.verifyMcpRequest(auth, createContext({host: "attacker.example.com"}))) as Response;

      expect(result.headers.get("www-authenticate")).toContain(
        'resource_metadata="https://api.example.com/.well-known/oauth-protected-resource/mcp"'
      );
      expect(result.headers.get("www-authenticate")).not.toContain("attacker.example.com");
    });

    it("reuses the same verifier across requests", async () => {
      const service = inject(PlatformMcpAuthService);
      const auth = createAuth({verifier: createVerifier()});
      vi.spyOn(service, "getVerifier");

      await service.verifyMcpRequest(auth, createContext({authorization: "Bearer valid"}));
      await service.verifyMcpRequest(auth, createContext({authorization: "Bearer valid"}));

      const [first, second] = vi.mocked(service.getVerifier).mock.results;

      expect(first.value).toBe(second.value);
    });
  });
});
