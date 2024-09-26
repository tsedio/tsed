import {Constant, Injectable} from "@tsed/di";
import type {JwksKeyParameters} from "@tsed/jwks";
import {getJwks} from "@tsed/jwks";
import {join} from "path";

@Injectable()
export class OidcJwks {
  @Constant("oidc.jwksPath", join(process.cwd(), "keys", "jwks.json"))
  jwksPath: string;

  @Constant("oidc.certificates")
  certificates?: JwksKeyParameters[];

  keys: string;

  $onInit() {
    return this.getJwks();
  }

  getJwks() {
    return getJwks({
      path: this.jwksPath,
      certificates: this.certificates
    });
  }
}
