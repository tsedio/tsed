import {useDecorators} from "@tsed/core";
import {Authenticate} from "@tsed/passport";
import {In, Returns, Security} from "@tsed/schema";
import {OAuthHead} from "./OAuthHead";

export function OAuthBearer(options: any = {}): Function {
  return useDecorators(
    Authenticate("azure-bearer", {session: false, ...options}),
    // Metadata for swagger
    Security("oauth", ...(options.scopes || [])),
    In("header").Name("Authorization").Type(String).Required(true),
    Returns(401).Description("Unauthorized"),
    Returns(403).Description("Forbidden"),
    OAuthHead()
  );
}
