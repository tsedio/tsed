import {OpenSpecExternalDocs} from "../common/OpenSpecExternalDocs.js";
import {OpenSpecHash} from "../common/OpenSpecHash.js";
import {OpenSpecInfo} from "../common/OpenSpecInfo.js";
import {OpenSpecSecurity} from "../common/OpenSpecSecurity.js";
import {OpenSpecTag} from "../common/OpenSpecTag.js";
import {OS3Components} from "./OS3Components.js";
import {OS3Paths} from "./OS3Paths.js";
import {OS3Schema} from "./OS3Schema.js";
import {OS3Server} from "./OS3Server.js";

export interface OpenSpec3<Schema = OS3Schema> {
  /**
   * This string MUST be the semantic version number of the OpenAPI Specification version that the OpenAPI document uses. The openapi field SHOULD be used by tooling specifications and clients to interpret the OpenAPI document. This is not related to the API info.version string.
   */
  openapi: string;
  /**
   * Provides metadata about the API. The metadata MAY be used by tooling as required.
   */
  info: OpenSpecInfo;
  /**
   * An array of Server Objects, which provide connectivity information to a target server. If the servers property is not provided, or is an empty array, the default value would be a Server Object with a url value of /.
   */
  servers?: OS3Server[];
  /**
   * The available paths and operations for the API.
   */
  paths: OpenSpecHash<OS3Paths<Schema>>;
  /**
   * An element to hold various schemas for the specification.
   */
  components?: OS3Components<Schema>;
  /**
   * A declaration of which security mechanisms can be used across the API. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. Individual operations can override this definition.
   */
  security?: OpenSpecSecurity;
  /**
   * A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
   */
  tags?: OpenSpecTag[];
  /**
   * Additional external documentation.
   */
  externalDocs?: OpenSpecExternalDocs;
}
