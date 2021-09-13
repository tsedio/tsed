import {ensureDirSync, existsSync, readFileSync, writeFileSync} from "fs-extra";
import {JWK, JWKS, KeyParameters} from "jose2";
import {dirname} from "path";

export interface JwksKeyParameters extends KeyParameters {
  path: string;
}

export interface JwksOptions {
  path: string;
  certificates?: JwksKeyParameters[];
}

export function generateJwks(options: Partial<JwksOptions> = {}) {
  const {certificates} = options;
  const keystore = new JWKS.KeyStore();

  if (certificates) {
    certificates.forEach(({path, ...options}) => {
      const content = readFileSync(path, {encoding: "utf-8"});
      const isPrivate = content.includes("PRIVATE KEY");

      if (!isPrivate) {
        keystore.add(JWK.asKey(content, options));
      }
    });
  } else {
    keystore.generateSync("RSA", 2048, {use: "sig"});
    keystore.generateSync("EC", "P-256", {use: "sig", alg: "ES256"});
    keystore.generateSync("OKP", "Ed25519", {use: "sig", alg: "EdDSA"});
  }

  return keystore.toJWKS(true);
}

export function getJwks(options: JwksOptions) {
  ensureDirSync(dirname(options.path));

  if (!existsSync(options.path)) {
    const keys = generateJwks(options);
    writeFileSync(options.path, JSON.stringify(keys, null, 2));
  }

  return JSON.parse(readFileSync(options.path, {encoding: "utf-8"}));
}
