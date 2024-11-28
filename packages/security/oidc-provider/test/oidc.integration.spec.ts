import {MemoryAdapter} from "@tsed/adapters";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {join} from "path";
import SuperTest from "supertest";

import {rootDir} from "../../../platform/platform-express/test/app/Server.js";
import {InteractionsCtrl} from "./app/controllers/oidc/InteractionsCtrl.js";
import {Server} from "./app/Server.js";
import {Accounts} from "./app/services/Accounts.js";

const testDir = import.meta.dirname;

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("OIDC", () => {
  let request: SuperTest.Agent;

  function followRedirection(response: any, headers: any = {}) {
    if (response.headers.location) {
      const url = response.headers.location.replace("http://0.0.0.0:8081", "");
      return request.get(url).set("Origin", "http://0.0.0.0:8081").set("Host", "0.0.0.0:8081").set(headers);
    }

    return Promise.resolve(response);
  }

  beforeEach(
    utils.bootstrap({
      mount: {
        "/": [InteractionsCtrl]
      },
      adapters: {
        Adapter: MemoryAdapter
      }
    })
  );
  beforeEach(() => {
    request = SuperTest.agent(PlatformTest.callback());
  });

  afterEach(() => PlatformTest.reset());

  it("should display the OIDC login page then login", async () => {
    const authRes = await request
      .get(
        "/oidc/auth?client_id=client_id&response_type=id_token&scope=openid+email&nonce=foobar&prompt=login&redirect_uri=http://localhost:3000"
      )
      .set({
        Origin: "http://0.0.0.0:8081",
        Host: "0.0.0.0:8081"
      });

    const [, , id] = authRes.headers.location.replace("http://0.0.0.0:8081", "").split("/");

    const response = await followRedirection(authRes);

    expect(response.text).toContain("Sign-in");

    const postResponse = await request
      .post(`${authRes.headers.location}/login`)
      .set({
        Origin: "http://0.0.0.0:8081",
        Host: "0.0.0.0:8081",
        "Upgrade-Insecure-Requests": "1",
        referer: `http://0.0.0.0:8081/interaction/${id}`
      })
      .send("email=test%40test.com&password=admin");

    expect(postResponse.headers.location).toEqual(`http://0.0.0.0:8081/oidc/auth/${id}`);

    const headers = {
      Origin: "http://0.0.0.0:8081",
      Host: "0.0.0.0:8081",
      "Upgrade-Insecure-Requests": "1",
      referer: `http://0.0.0.0:8081/interaction/${id}`
    };

    const consentResponse = await followRedirection(await followRedirection(postResponse, headers), headers);

    const matches = consentResponse.text.match(/action="(.*)" /gi);
    const interactionUrl = matches[0].split('"')[1];

    const confirmResponse = await followRedirection(
      await request.post(interactionUrl).set({
        Origin: "http://0.0.0.0:8081",
        Host: "0.0.0.0:8081",
        "Upgrade-Insecure-Requests": "1",
        referer: `http://0.0.0.0:8081/interaction/${id}`
      }),
      headers
    );

    expect(confirmResponse.headers.location).toContain("http://localhost:3000/#id_token=");
  });

  it("should display the discovery page on /.well-known/openid-configuration", async () => {
    const res = await request.get("/.well-known/openid-configuration").set({
      Origin: "http://0.0.0.0:8081",
      Host: "0.0.0.0:8081"
    });
    expect(JSON.parse(res.text).authorization_endpoint).toEqual("http://0.0.0.0:8081/oidc/auth");
  });
});

describe("OIDC on a different path", () => {
  let request: SuperTest.Agent;

  function followRedirection(response: any, headers: any = {}) {
    if (response.headers.location) {
      const url = response.headers.location.replace("http://0.0.0.0:8081", "");
      return request.get(url).set("Origin", "http://0.0.0.0:8081").set("Host", "0.0.0.0:8081").set(headers);
    }

    return Promise.resolve(response);
  }

  beforeEach(
    utils.bootstrap({
      mount: {
        "/": [InteractionsCtrl]
      },
      oidc: {
        path: "/oidc",
        Accounts: Accounts,
        jwksPath: join(testDir, "..", "..", "keys", "jwks.json"),
        clients: [
          {
            client_id: "client_id",
            client_secret: "client_secret",
            redirect_uris: ["http://localhost:3000"],
            response_types: ["id_token"],
            grant_types: ["implicit"],
            token_endpoint_auth_method: "none"
          }
        ],
        claims: {
          openid: ["sub"],
          email: ["email", "email_verified"]
        },
        features: {
          // disable the packaged interactions
          devInteractions: {enabled: false},
          encryption: {enabled: true},
          introspection: {enabled: true},
          revocation: {enabled: true}
        }
      },
      adapters: {
        Adapter: MemoryAdapter
      }
    })
  );
  beforeEach(() => {
    request = SuperTest.agent(PlatformTest.callback());
  });

  afterEach(() => PlatformTest.reset());

  it("should display the OIDC login page then login", async () => {
    const authRes = await request
      .get(
        "/oidc/auth?client_id=client_id&response_type=id_token&scope=openid+email&nonce=foobar&prompt=login&redirect_uri=http://localhost:3000"
      )
      .set({
        Origin: "http://0.0.0.0:8081",
        Host: "0.0.0.0:8081"
      });

    const [, , id] = authRes.headers.location.replace("http://0.0.0.0:8081", "").split("/");

    const response = await followRedirection(authRes);

    expect(response.text).toContain("Sign-in");

    const postResponse = await request
      .post(`${authRes.headers.location}/login`)
      .set({
        Origin: "http://0.0.0.0:8081",
        Host: "0.0.0.0:8081",
        "Upgrade-Insecure-Requests": "1",
        referer: `http://0.0.0.0:8081/interaction/${id}`
      })
      .send("email=test%40test.com&password=admin");

    expect(postResponse.headers.location).toEqual(`http://0.0.0.0:8081/oidc/auth/${id}`);

    const headers = {
      Origin: "http://0.0.0.0:8081",
      Host: "0.0.0.0:8081",
      "Upgrade-Insecure-Requests": "1",
      referer: `http://0.0.0.0:8081/interaction/${id}`
    };

    const consentResponse = await followRedirection(await followRedirection(postResponse, headers), headers);

    const matches = consentResponse.text.match(/action="(.*)" /gi);
    const interactionUrl = matches[0].split('"')[1];

    const confirmResponse = await followRedirection(
      await request.post(interactionUrl).set({
        Origin: "http://0.0.0.0:8081",
        Host: "0.0.0.0:8081",
        "Upgrade-Insecure-Requests": "1",
        referer: `http://0.0.0.0:8081/interaction/${id}`
      }),
      headers
    );

    expect(confirmResponse.headers.location).toContain("http://localhost:3000/#id_token=");
  });

  it("should display the discovery page on /.well-known/openid-configuration", async () => {
    const res = await request.get("/.well-known/openid-configuration").set({
      Origin: "http://0.0.0.0:8081",
      Host: "0.0.0.0:8081"
    });
    expect(JSON.parse(res.text).authorization_endpoint).toEqual("http://0.0.0.0:8081/oidc/auth");
  });
});
