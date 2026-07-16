import {Injectable, constant} from "@tsed/di";
import {JwksKeyParameters, getJwks} from "@tsed/jwks";
import {join} from "node:path";

@Injectable()
export class OidcJwks {
  public jwksPath: string = constant("oidc.jwksPath", join(process.cwd(), "keys", "jwks.json"));
  public certificates?: JwksKeyParameters[] = constant("oidc.certificates");
  public keys!: string;

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
