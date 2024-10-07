import {constant, Injectable} from "@tsed/di";
import {getJwks, JwksKeyParameters} from "@tsed/jwks";
import {join} from "path";

@Injectable()
export class OidcJwks {
  public jwksPath: string = constant("oidc.jwksPath", join(process.cwd(), "keys", "jwks.json"));
  public certificates?: JwksKeyParameters[] = constant("oidc.certificates");
  public keys: string;

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
