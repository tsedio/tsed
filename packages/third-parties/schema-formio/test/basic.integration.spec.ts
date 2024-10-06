import {
  AdditionalProperties,
  CollectionOf,
  Default,
  Description,
  Enum,
  Format,
  Groups,
  Integer,
  ReadOnly,
  Required,
  Title,
  Uri
} from "@tsed/schema";

import {getFormioSchema, InputTags, TableView} from "../src/index.js";

export enum OIDCResponseTypes {
  CODE = "code",
  ID_TOKEN_TOKEN = "id_token token",
  CODE_ID_TOKEN_TOKEN = "code id_token token",
  TOKEN = "token",
  NONE = "none"
}

export enum OIDCGrantTypes {
  AUTHORIZATION_CODE = "authorization_code",
  IMPLICIT = "implicit",
  REFRESH_TOKEN = "refresh_token",
  CLIENT_CREDENTIALS = "client_credentials"
}

export enum OIDCApplicationTypes {
  WEB = "web",
  NATIVE = "native",
  SERVICE = "service"
}

export enum OIDCTokenEndpointAuthMethod {
  CLIENT_SECRET_POST = "client_secret_post",
  CLIENT_SECRET_BASIC = "client_secret_basic",
  CLIENT_SECRET_JWT = "client_secret_jwt",
  PRIVATE_KEY_JWT = "private_key_jwt",
  NONE = "none"
}

export class OIDCBase {
  @ReadOnly()
  @Groups("!creation", "!update")
  @Format("date-time")
  created?: Date;

  @ReadOnly()
  @Groups("!creation", "!update")
  @Format("date-time")
  modified?: Date;
}

@AdditionalProperties(true)
export class OIDCClient extends OIDCBase {
  @Required()
  @TableView(true)
  clientName?: string;

  @Groups("!creation", "!update")
  @Required()
  @ReadOnly()
  @TableView(true)
  clientId: string;

  @Groups("!creation", "!update")
  @Required()
  @ReadOnly()
  clientSecret: string;

  @Default(false)
  @Required()
  trusted: boolean = false;

  @Uri()
  clientUri?: string;

  @Uri()
  @TableView(true)
  logoUri?: string;

  @Enum(OIDCApplicationTypes) // types: web, native, service
  @Default(OIDCApplicationTypes.WEB)
  @Required()
  applicationType: OIDCApplicationTypes;

  @Uri()
  @CollectionOf(String)
  redirectUris: string[];

  @Enum(OIDCResponseTypes)
  @CollectionOf(String)
  responseTypes: OIDCResponseTypes[]; // types: code / id_token token / code id_token token / token / none

  @Enum(OIDCGrantTypes)
  @CollectionOf(String) // types: authorization_code, implicit, refresh_token, client_credentials
  grantTypes: OIDCGrantTypes[];

  @Enum(OIDCTokenEndpointAuthMethod)
  @Default(OIDCTokenEndpointAuthMethod.CLIENT_SECRET_BASIC)
  tokenEndpointAuthMethod?: string;

  @Integer()
  @Default(3600)
  defaultMaxAge?: number;

  @Uri()
  @CollectionOf(String)
  postLogoutRedirectUris: string[];

  @CollectionOf(String)
  @TableView(true)
  @InputTags()
  scopes: string[];

  @Default("clubmed")
  @Title("Theme")
  @Description("Change the template display on OIDC group1")
  @Groups("group1")
  @Enum(...(process.env.OIDC_THEMES || "clubmed;myclubmed").split(";"))
  theme: string = "clubmed";

  @Default(true)
  @Title("Enable Google Tags")
  @Description("Import Google tags scripts for this client on OIDC group1 Login page")
  @Groups("group1")
  enableGoogleAd: boolean = true;

  @Default(true)
  @Title("Enable Social Login")
  @Description("Display socials login buttons for this client on OIDC group1 Login page")
  @Groups("group1")
  enableConnectionProvider: boolean = true;

  @Default(false)
  @Title("Hide account creation link")
  @Description("Disable the account creation link on OIDC group1")
  @Groups("group1")
  hideAccountCreation: boolean = false;

  set _id(id: string) {
    this.clientId = id;
  }
}

describe("Basic", () => {
  it("should generate the correct schema", async () => {
    const form = await getFormioSchema(OIDCClient, {groups: ["group1"]});

    expect(form).toMatchSnapshot();
  });
});
