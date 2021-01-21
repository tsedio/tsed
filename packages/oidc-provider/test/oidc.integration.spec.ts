import {MemoryAdapter} from "@tsed/adapters";
import {PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTestUtils} from "@tsed/platform-test-utils";
import {expect} from "chai";
import SuperTest from "supertest";
import {rootDir} from "../../platform-express/test/app/Server";
import {InteractionsCtrl} from "./app/controllers/oidc/InteractionsCtrl";
import {Server} from "./app/Server";

const utils = PlatformTestUtils.create({
  rootDir,
  platform: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("OIDC", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  async function followRedirection(response: any, headers: any = {}) {
    if (response.headers.location) {
      const url = response.headers.location.replace("http://0.0.0.0:8081", "");
      return request.get(url)
        .set("Origin", "http://0.0.0.0:8081")
        .set("Host", "0.0.0.0:8081")
        .set(headers);
    }

    return response;
  }

  beforeEach(utils.bootstrap({
    mount: {
      "/": [InteractionsCtrl]
    },
    adapters: {
      Adapter: MemoryAdapter
    }
  }));
  beforeEach(() => {
    request = SuperTest.agent(PlatformTest.callback());
  });

  afterEach(() => PlatformTest.reset());

  it("should display the OIDC login page then login", async () => {
    const authRes = await request
      .get("/auth?client_id=client_id&response_type=id_token&scope=openid+email&nonce=foobar&prompt=login&redirect_uri=http://localhost:3000")
      .set({
        "Origin": "http://0.0.0.0:8081",
        "Host": "0.0.0.0:8081"
      });

    const [, , id] = authRes.headers.location.replace("http://0.0.0.0:8081", "").split("/");

    const response = await followRedirection(authRes);

    expect(response.text).to.includes("Sign-in");

    const postResponse = await request
      .post(`${authRes.headers.location}/login`)
      .set({
        "Origin": "http://0.0.0.0:8081",
        "Host": "0.0.0.0:8081",
        "Upgrade-Insecure-Requests": "1",
        "referer": `http://0.0.0.0:8081/interaction/${id}`
      })
      .send("email=test%40test.com&password=admin");

    expect(postResponse.headers.location).to.equal(`http://0.0.0.0:8081/auth/${id}`);

    const headers = {
      "Origin": "http://0.0.0.0:8081",
      "Host": "0.0.0.0:8081",
      "Upgrade-Insecure-Requests": "1",
      "referer": `http://0.0.0.0:8081/interaction/${id}`
    };

    const consentResponse = await followRedirection(await followRedirection(postResponse, headers), headers);

    expect(consentResponse.text).to.contains(`${authRes.headers.location}/confirm`);

    const confirmResponse = await followRedirection(await request
      .post(`${authRes.headers.location}/confirm`)
      .set({
        "Origin": "http://0.0.0.0:8081",
        "Host": "0.0.0.0:8081",
        "Upgrade-Insecure-Requests": "1",
        "referer": `http://0.0.0.0:8081/interaction/${id}`
      }), headers);

    expect(confirmResponse.headers.location).to.contain("http://localhost:3000#id_token=");
  });
});