import {Constant, Injectable} from "@tsed/di";
import {join} from "path";
import {getJwks, JwksKeyParameters} from "@tsed/jwks";

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
