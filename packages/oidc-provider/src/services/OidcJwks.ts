import {Constant, Injectable} from "@tsed/di";
import {ensureDirSync, existsSync, readFileSync, writeFileSync} from "fs-extra";
import {dirname, join} from "path";

const jose = require("jose2");

@Injectable()
export class OidcJwks {
  @Constant("oidc.jwksPath", join(process.cwd(), "keys", "jwks.json"))
  jwksPath: string;

  keys: string;

  fs = {
    ensureDirSync,
    existsSync,
    readFileSync,
    writeFileSync
  };

  async $onInit() {
    return this.getJwks();
  }

  exists() {
    return this.fs.existsSync(this.jwksPath);
  }

  async generate() {
    const keystore = new jose.JWKS.KeyStore();

    await Promise.all([
      keystore.generate("RSA", 2048, {use: "sig"}),
      keystore.generate("EC", "P-256", {use: "sig", alg: "ES256"}),
      keystore.generate("OKP", "Ed25519", {use: "sig", alg: "EdDSA"})
    ]);

    this.fs.ensureDirSync(dirname(this.jwksPath));
    this.fs.writeFileSync(this.jwksPath, JSON.stringify(keystore.toJWKS(true), null, 2));
  }

  async getJwks() {
    if (!this.exists()) {
      await this.generate();
    }

    return JSON.parse(this.fs.readFileSync(this.jwksPath, {encoding: "utf-8"}));
  }
}
