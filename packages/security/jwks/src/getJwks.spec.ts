import fs from "fs-extra";
import {join} from "path";

import {generateJwks, getJwks} from "./getJwks.js";

const rootDir = join(import.meta.dirname, "__mocks__");

describe("GetJwks", () => {
  beforeEach(() => {
    fs.removeSync(join(rootDir, "generated", "keys.json"));
  });
  describe("generateJwks()", () => {
    it("should generate Jwks keys without certificates", async () => {
      const output = await generateJwks();

      expect(output.keys.length).toEqual(3);
    });
    it("should generateJwks keys from certificates", async () => {
      const output = await generateJwks({
        certificates: [
          {path: join(rootDir, "keys", "sig.rsa.pub.pem"), alg: "RS256", use: "sig", kid: "key-0"},
          {path: join(rootDir, "keys", "sig.rsa.prv.pem"), alg: "RS256", use: "sig"},
          {path: join(rootDir, "keys", "enc.rsa.pub.pem"), alg: "RS256", use: "enc", kid: "key-1"},
          {path: join(rootDir, "keys", "enc.rsa.prv.pem"), alg: "RS256", use: "enc"}
        ] as never[]
      });

      expect(output).toEqual({
        keys: [
          {
            alg: "RS256",
            e: "AQAB",
            kid: "key-0",
            kty: "RSA",
            n: "rQ-VYeRDY-Y6gPMCSLWLzWB2CSvAIxmE1VN_IRJlvjheATFgWQT4qcsFSK7EQ1frz-DhjmCUQcFQ53ubDKz-f4zHVEeH9-8H2bw2DZ0uUss3LDnA3ryZ9J1Qhxp7bcsyKQOmCDnqMhLd8Sp0B8v1vKmCvXAd4NOz1BhDkCWI7LhZjEzGRqy3mPHp2JKhyM4DPa5FLlpQnWOAmy-W39gmNwfpnz6zpIBrkKglWEpHCdT59fxsyslz3anxklGKMBGwUa3ZHiwN_VTkPU39K_p2Xop5mtvO9rh87vImWbAE8w8nSPO7wmCTiBJY-bgG4KeXbB1NLAyEfaty2RXMh8vaCAlpT-FKxO6u1DGcrsvAmkOmHsGIIYtd3syxVhYkrFKZU1vhDJq1jER9JlKGnzCYSrXINJ4iNEk5gIw8YJtAmJsj2gVYdLCJx4HUXv77WC-xDQ7MAYqIYF5fL2R-k-dpaJs-Fyn76vf8yr2SDC4j442P-Evt78NYl5_sIOKS47GKNx7V-JIcA2TJVZyKTmeQQCpMhFuLJIJBxBF6S998oEgM4cPtZSOfugByu0rjf3CfQXl32Qc6dVXtOeIzZlzM3dxOnvzVsiM9kiYp9d7uKFGkQXgyw7umI-VrWQIDwi7ppJIX6fuemJD9KxtA34Wae3qtm9ISXV7NeZIXt5d1-Dc",
            use: "sig"
          },
          {
            alg: "RS256",
            e: "AQAB",
            kid: "key-1",
            kty: "RSA",
            n: "ooP_p2isfqsJH-OAPT3lvCJOFCxgscE0SC8zj0sWs_r_N5zm7UTaU0PgH6NLURkNSiAqDfzKFfeV9QxkzYRlHJ-JFt32MC-ypk-93gOYJOMOVk4JGHi5U77D_5tD3mjWe6bQM6k8wKgp44-sboq_FDauA9dM-Mw0LSeueGBo9TigQ7U0vTKfGYRWZv70X6lEePdeej5aoc3IhU5bX81fjvKKutwyoza4ovXPJuOwYJOhAsMmkZjWbi8qjXCFuz1arVxsb2qNOjmQlk-Yolegj16Wfcs-W83TTU7-Heijl3YVHi-XLPstemGiPGJhAikQWCv9udYFqlZjhyX22iStqPYBDkqi0lVy0bUVs0pmD90BB46kXmvHpxiwh-oDPtGZzt0lzcjmVP1HXF2X-c9i2xLsKvibbizqqQ5G7okPs5MO-Jvww0_6--T4ATM5MzxIIN1cWH_uq7SKoP_Fsphe6GeeJrtD_Ww2T30ZQVzoSYMZE_PvH6wVegb0IrWhXH5tklFDYkJXyAmLPAReMXuZMTg7EXaMU2ACGShXp7bN6gxrkcVaA4TnOQgEALCI1rusORUyf8wOYIW5iLdXcnaY5GZgH2OymyCZ6AzxsAc4TpwDrGNHuA5oitucfqLicUAAoGItn9rJOTQ6M2HkyqS-TeKwmmz2mb1oslGfSCJ9y4U",
            use: "enc"
          }
        ]
      });
    });
  });
  describe("getJwks()", () => {
    it("should generate Jwks keys without certificates", () => {
      const output = getJwks({
        path: join(rootDir, "generated", "keys.json")
      });

      expect(output.keys.length).toEqual(3);
    });
  });
});
