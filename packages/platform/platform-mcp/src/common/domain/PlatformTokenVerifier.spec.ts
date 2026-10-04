import {createServer, type Server} from "node:http";
import type {AddressInfo} from "node:net";
import {exportJWK, generateKeyPair, SignJWT} from "jose";
import type {McpAuthSettings} from "../interfaces/McpAuthSettings.js";
import {PlatformTokenVerifier} from "./PlatformTokenVerifier.js";

function createVerifier(auth: McpAuthSettings, resource: URL) {
  return new PlatformTokenVerifier(auth, resource);
}

const resource = new URL("https://api.example.com/mcp");

describe("PlatformTokenVerifier", () => {
  let server: Server;
  let issuer: string;
  let keys: Awaited<ReturnType<typeof generateKeyPair>>;
  let requests: {url: string; authorization?: string; body: string}[];
  let introspection: Record<string, unknown>;
  let failing: string[];

  const exp = () => Math.floor(Date.now() / 1000) + 3600;

  function sign({aud = resource.href, ...claims}: Record<string, unknown> = {}, key = keys.privateKey) {
    return new SignJWT({client_id: "client", scope: "mcp:read mcp:write", ...claims})
      .setProtectedHeader({alg: "RS256", kid: "key", typ: "at+jwt"})
      .setIssuedAt()
      .setJti(String(Math.random()))
      .setIssuer(issuer)
      .setAudience(aud as string)
      .setSubject("user-1")
      .setExpirationTime(exp())
      .sign(key);
  }

  function auth(opts: Partial<McpAuthSettings> = {}): McpAuthSettings {
    return {issuer, allowInsecureRequests: true, ...opts};
  }

  beforeAll(async () => {
    keys = await generateKeyPair("RS256");

    const jwk = {...(await exportJWK(keys.publicKey)), kid: "key", alg: "RS256", use: "sig"};

    server = createServer((req, res) => {
      let body = "";

      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        requests.push({url: req.url!, authorization: req.headers.authorization, body});

        const routes: Record<string, unknown> = {
          "/.well-known/openid-configuration": {
            issuer,
            jwks_uri: `${issuer}/jwks`,
            introspection_endpoint: `${issuer}/introspect`
          },
          "/jwks": {keys: [jwk]},
          "/introspect": introspection
        };
        const found = !failing.includes(req.url!) && routes[req.url!];

        res.writeHead(found ? 200 : 500, {"content-type": "application/json"}).end(JSON.stringify(found || {}));
      });
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));

    issuer = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  beforeEach(() => {
    requests = [];
    failing = [];
    introspection = {active: true, client_id: "client", scope: "mcp:read", exp: exp(), sub: "user-1", aud: resource.href};
  });

  afterAll(() => new Promise((resolve) => server.close(resolve)));

  describe("getMode()", () => {
    it("defaults to offline, and to introspection when client credentials are configured", () => {
      expect(PlatformTokenVerifier.getMode({issuer: "https://auth"})).toBe("offline");
      expect(PlatformTokenVerifier.getMode({issuer: "https://auth", clientId: "id", clientSecret: "secret"})).toBe("introspection");
      expect(PlatformTokenVerifier.getMode({issuer: "https://auth", clientId: "id", mode: "offline"})).toBe("offline");
    });
  });

  describe("offline", () => {
    it("verifies a JWT against the issuer JWKS", async () => {
      const token = await sign();
      const authInfo = await createVerifier(auth(), resource).verifyAccessToken(token);

      expect(authInfo).toMatchObject({
        token,
        clientId: "client",
        scopes: ["mcp:read", "mcp:write"],
        expiresAt: expect.any(Number),
        extra: {sub: "user-1", iss: issuer}
      });
    });

    it("discovers and fetches the JWKS once per endpoint", async () => {
      const settings = auth();

      const verifier = createVerifier(settings, resource);

      await verifier.verifyAccessToken(await sign());
      await verifier.verifyAccessToken(await sign());

      expect(requests.map(({url}) => url)).toEqual(["/.well-known/openid-configuration", "/jwks"]);
    });

    it("skips the discovery when the JWKS URL is configured", async () => {
      const verifier = createVerifier(auth({jwksUri: `${issuer}/jwks`}), resource);

      await expect(verifier.verifyAccessToken(await sign())).resolves.toBeDefined();
      expect(requests.map(({url}) => url)).toEqual(["/jwks"]);
    });

    it("rejects a token issued for another audience", async () => {
      const verifier = createVerifier(auth(), new URL("https://api.example.com/other"));

      await expect(verifier.verifyAccessToken(await sign())).rejects.toMatchObject({code: "invalid_token"});
    });

    it("accepts the configured audience", async () => {
      const verifier = createVerifier(auth({audience: "custom"}), resource);

      await expect(verifier.verifyAccessToken(await sign({aud: "custom"}))).resolves.toBeDefined();
    });

    it("rejects a token signed with an unknown key", async () => {
      const other = await generateKeyPair("RS256");
      const verifier = createVerifier(auth(), resource);

      await expect(verifier.verifyAccessToken(await sign({}, other.privateKey))).rejects.toMatchObject({code: "invalid_token"});
    });

    it("rejects opaque tokens", async () => {
      await expect(createVerifier(auth(), resource).verifyAccessToken("opaque")).rejects.toMatchObject({code: "invalid_token"});
    });

    it("reports a server error when the issuer metadata cannot be loaded, then retries", async () => {
      const settings = auth();
      failing = ["/.well-known/openid-configuration", "/.well-known/oauth-authorization-server"];

      const verifier = createVerifier(settings, resource);

      await expect(verifier.verifyAccessToken(await sign())).rejects.toMatchObject({code: "server_error"});

      failing = [];

      await expect(verifier.verifyAccessToken(await sign())).resolves.toBeDefined();
    });

    it("reports a server error when the JWKS cannot be fetched", async () => {
      failing = ["/jwks"];

      await expect(createVerifier(auth(), resource).verifyAccessToken(await sign())).rejects.toMatchObject({code: "server_error"});
    });
  });

  describe("custom verifier", () => {
    const authInfo = {token: "abc", clientId: "client", scopes: [], expiresAt: 1};

    it("delegates to the configured verifier instead of the built-in modes", async () => {
      const verifyAccessToken = vi.fn().mockResolvedValue(authInfo);
      const verifier = createVerifier(auth({verifier: {verifyAccessToken}}), resource);

      await expect(verifier.verifyAccessToken("abc")).resolves.toBe(authInfo);
      expect(verifyAccessToken).toHaveBeenCalledExactlyOnceWith("abc");
      expect(requests).toEqual([]);
    });

    it("reports any verifier failure as an invalid token without leaking its message", async () => {
      const verifier = createVerifier(auth({verifier: {verifyAccessToken: vi.fn().mockRejectedValue(new Error("db down"))}}), resource);

      await expect(verifier.verifyAccessToken("abc")).rejects.toMatchObject({code: "invalid_token", message: "Invalid access token"});
    });
  });

  describe("introspection", () => {
    const credentials = {clientId: "gateway", clientSecret: "s3cret"};

    it("asks the authorization server with the endpoint credentials", async () => {
      const authInfo = await createVerifier(auth(credentials), resource).verifyAccessToken("opaque");

      expect(authInfo).toMatchObject({token: "opaque", clientId: "client", scopes: ["mcp:read"], extra: {sub: "user-1"}});
      expect(requests.at(-1)).toMatchObject({
        url: "/introspect",
        authorization: `Basic ${Buffer.from("gateway:s3cret").toString("base64")}`,
        body: expect.stringContaining("token=opaque")
      });
    });

    it("skips the discovery when the introspection endpoint is configured", async () => {
      const verifier = createVerifier(auth({...credentials, introspectionEndpoint: `${issuer}/introspect`}), resource);

      await expect(verifier.verifyAccessToken("opaque")).resolves.toBeDefined();
      expect(requests.map(({url}) => url)).toEqual(["/introspect"]);
    });

    it("drops the oldest cached result when the cache is full", async () => {
      const verifier = createVerifier(auth(credentials), resource);
      const cache: Map<string, unknown> = verifier["cache"];

      for (let index = 0; index < 1000; index++) {
        cache.set(`token-${index}`, {authInfo: {}, until: Date.now() + 60_000});
      }

      await verifier.verifyAccessToken("opaque");

      expect(cache.size).toBe(1000);
      expect(cache.has("token-0")).toBe(false);
      expect(cache.has("token-1")).toBe(true);
    });

    it("maps the scp, azp and multi-valued aud claims of the introspection response", async () => {
      introspection = {active: true, azp: "authorized-party", scp: ["mcp:read", "mcp:write"], exp: exp(), aud: ["other", resource.href]};

      await expect(createVerifier(auth(credentials), resource).verifyAccessToken("opaque")).resolves.toMatchObject({
        clientId: "authorized-party",
        scopes: ["mcp:read", "mcp:write"]
      });
    });

    it("rejects inactive tokens", async () => {
      introspection = {active: false};

      await expect(createVerifier(auth(credentials), resource).verifyAccessToken("opaque")).rejects.toMatchObject({
        code: "invalid_token"
      });
    });

    it("rejects tokens reported for another issuer or audience", async () => {
      introspection = {...introspection, iss: "https://other"};

      await expect(createVerifier(auth(credentials), resource).verifyAccessToken("a")).rejects.toMatchObject({
        code: "invalid_token"
      });

      introspection = {...introspection, iss: issuer, aud: "https://api.example.com/other"};

      await expect(createVerifier(auth(credentials), resource).verifyAccessToken("b")).rejects.toMatchObject({
        code: "invalid_token"
      });

      introspection = {...introspection, aud: [resource.href]};

      await expect(createVerifier(auth(credentials), resource).verifyAccessToken("c")).resolves.toBeDefined();
    });

    it("rejects tokens reported without audience", async () => {
      introspection = {...introspection, aud: undefined};

      await expect(createVerifier(auth(credentials), resource).verifyAccessToken("opaque")).rejects.toMatchObject({
        code: "invalid_token"
      });
    });

    it("accepts tokens without audience when the audience check is disabled", async () => {
      introspection = {...introspection, aud: undefined};

      const verifier = createVerifier(auth({...credentials, audience: false}), resource);

      await expect(verifier.verifyAccessToken("opaque")).resolves.toMatchObject({clientId: "client"});
    });

    it("caches the introspection result", async () => {
      const settings = auth(credentials);

      const verifier = createVerifier(settings, resource);

      await verifier.verifyAccessToken("opaque");
      await verifier.verifyAccessToken("opaque");

      expect(requests.filter(({url}) => url === "/introspect")).toHaveLength(1);
    });

    it("does not cache when cacheTtl is 0", async () => {
      const settings = auth({...credentials, cacheTtl: 0});

      const verifier = createVerifier(settings, resource);

      await verifier.verifyAccessToken("opaque");
      await verifier.verifyAccessToken("opaque");

      expect(requests.filter(({url}) => url === "/introspect")).toHaveLength(2);
    });

    it("reports a server error when the introspection endpoint fails", async () => {
      failing = ["/introspect"];

      await expect(createVerifier(auth(credentials), resource).verifyAccessToken("opaque")).rejects.toMatchObject({
        code: "server_error"
      });
    });
  });
});
