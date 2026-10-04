import {createServer, type Server} from "node:http";
import type {AddressInfo} from "node:net";
import {exportJWK, generateKeyPair, SignJWT} from "jose";
import type {McpAuthSettings} from "../../common/interfaces/McpAuthSettings.js";
import {createMcpTokenVerifier, getMcpAuthMode} from "./createMcpTokenVerifier.js";

const resource = new URL("https://api.example.com/mcp");

describe("createMcpTokenVerifier()", () => {
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

  describe("getMcpAuthMode()", () => {
    it("defaults to offline, and to introspection when client credentials are configured", () => {
      expect(getMcpAuthMode({issuer: "https://auth"})).toBe("offline");
      expect(getMcpAuthMode({issuer: "https://auth", clientId: "id", clientSecret: "secret"})).toBe("introspection");
      expect(getMcpAuthMode({issuer: "https://auth", clientId: "id", mode: "offline"})).toBe("offline");
    });
  });

  describe("offline", () => {
    it("verifies a JWT against the issuer JWKS", async () => {
      const token = await sign();
      const authInfo = await createMcpTokenVerifier(auth(), resource).verifyAccessToken(token);

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

      await createMcpTokenVerifier(settings, resource).verifyAccessToken(await sign());
      await createMcpTokenVerifier(settings, resource).verifyAccessToken(await sign());

      expect(requests.map(({url}) => url)).toEqual(["/.well-known/openid-configuration", "/jwks"]);
    });

    it("rejects a token issued for another audience", async () => {
      const verifier = createMcpTokenVerifier(auth(), new URL("https://api.example.com/other"));

      await expect(verifier.verifyAccessToken(await sign())).rejects.toMatchObject({code: "invalid_token"});
    });

    it("accepts the configured audience", async () => {
      const verifier = createMcpTokenVerifier(auth({audience: "custom"}), resource);

      await expect(verifier.verifyAccessToken(await sign({aud: "custom"}))).resolves.toBeDefined();
    });

    it("rejects a token signed with an unknown key", async () => {
      const other = await generateKeyPair("RS256");
      const verifier = createMcpTokenVerifier(auth(), resource);

      await expect(verifier.verifyAccessToken(await sign({}, other.privateKey))).rejects.toMatchObject({code: "invalid_token"});
    });

    it("rejects opaque tokens", async () => {
      await expect(createMcpTokenVerifier(auth(), resource).verifyAccessToken("opaque")).rejects.toMatchObject({code: "invalid_token"});
    });

    it("reports a server error when the issuer metadata cannot be loaded, then retries", async () => {
      const settings = auth();
      failing = ["/.well-known/openid-configuration", "/.well-known/oauth-authorization-server"];

      await expect(createMcpTokenVerifier(settings, resource).verifyAccessToken(await sign())).rejects.toMatchObject({
        code: "server_error"
      });

      failing = [];

      await expect(createMcpTokenVerifier(settings, resource).verifyAccessToken(await sign())).resolves.toBeDefined();
    });

    it("reports a server error when the JWKS cannot be fetched", async () => {
      failing = ["/jwks"];

      await expect(createMcpTokenVerifier(auth(), resource).verifyAccessToken(await sign())).rejects.toMatchObject({code: "server_error"});
    });
  });

  describe("introspection", () => {
    const credentials = {clientId: "gateway", clientSecret: "s3cret"};

    it("asks the authorization server with the endpoint credentials", async () => {
      const authInfo = await createMcpTokenVerifier(auth(credentials), resource).verifyAccessToken("opaque");

      expect(authInfo).toMatchObject({token: "opaque", clientId: "client", scopes: ["mcp:read"], extra: {sub: "user-1"}});
      expect(requests.at(-1)).toMatchObject({
        url: "/introspect",
        authorization: `Basic ${Buffer.from("gateway:s3cret").toString("base64")}`,
        body: expect.stringContaining("token=opaque")
      });
    });

    it("rejects inactive tokens", async () => {
      introspection = {active: false};

      await expect(createMcpTokenVerifier(auth(credentials), resource).verifyAccessToken("opaque")).rejects.toMatchObject({
        code: "invalid_token"
      });
    });

    it("rejects tokens reported for another issuer or audience", async () => {
      introspection = {...introspection, iss: "https://other"};

      await expect(createMcpTokenVerifier(auth(credentials), resource).verifyAccessToken("a")).rejects.toMatchObject({
        code: "invalid_token"
      });

      introspection = {...introspection, iss: issuer, aud: "https://api.example.com/other"};

      await expect(createMcpTokenVerifier(auth(credentials), resource).verifyAccessToken("b")).rejects.toMatchObject({
        code: "invalid_token"
      });

      introspection = {...introspection, aud: [resource.href]};

      await expect(createMcpTokenVerifier(auth(credentials), resource).verifyAccessToken("c")).resolves.toBeDefined();
    });

    it("rejects tokens reported without audience", async () => {
      introspection = {...introspection, aud: undefined};

      await expect(createMcpTokenVerifier(auth(credentials), resource).verifyAccessToken("opaque")).rejects.toMatchObject({
        code: "invalid_token"
      });
    });

    it("accepts tokens without audience when the audience check is disabled", async () => {
      introspection = {...introspection, aud: undefined};

      const verifier = createMcpTokenVerifier(auth({...credentials, audience: false}), resource);

      await expect(verifier.verifyAccessToken("opaque")).resolves.toMatchObject({clientId: "client"});
    });

    it("caches the introspection result", async () => {
      const settings = auth(credentials);

      await createMcpTokenVerifier(settings, resource).verifyAccessToken("opaque");
      await createMcpTokenVerifier(settings, resource).verifyAccessToken("opaque");

      expect(requests.filter(({url}) => url === "/introspect")).toHaveLength(1);
    });

    it("does not cache when cacheTtl is 0", async () => {
      const settings = auth({...credentials, cacheTtl: 0});

      await createMcpTokenVerifier(settings, resource).verifyAccessToken("opaque");
      await createMcpTokenVerifier(settings, resource).verifyAccessToken("opaque");

      expect(requests.filter(({url}) => url === "/introspect")).toHaveLength(2);
    });

    it("reports a server error when the introspection endpoint fails", async () => {
      failing = ["/introspect"];

      await expect(createMcpTokenVerifier(auth(credentials), resource).verifyAccessToken("opaque")).rejects.toMatchObject({
        code: "server_error"
      });
    });
  });
});
