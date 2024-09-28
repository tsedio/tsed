import {OpenSpecExternalDocs} from "../common/OpenSpecExternalDocs.js";
import {OpenSpecHash} from "../common/OpenSpecHash.js";
import {OpenSpecInfo} from "../common/OpenSpecInfo.js";
import {OpenSpecSecurity} from "../common/OpenSpecSecurity.js";
import {OpenSpecTag} from "../common/OpenSpecTag.js";
import {OS2BodyParameter, OS2QueryParameter} from "./OS2Parameter.js";
import {OS2Paths} from "./OS2Paths.js";
import {OS2Response} from "./OS2Response.js";
import {OS2Schema} from "./OS2Schema.js";
import {OS2Security} from "./OS2Security.js";

export interface OpenSpec2 {
  /**
   * Specifies the Swagger Specification version being used. It can be used by the Swagger UI and other clients to interpret the API listing. The value MUST be "2.0".
   */
  swagger: string;
  /**
   * Provides metadata about the API. The metadata can be used by the clients if needed.
   */
  info?: OpenSpecInfo;
  /**
   * The host (name or ip) serving the API. This MUST be the host only and does not include the scheme nor sub-paths. It MAY include a port. If the host is not included, the host serving the documentation is to be used (including the port). The host does not support [path templating](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#pathTemplating).
   */
  host?: string;
  /**
   * The base path on which the API is served, which is relative to the host. If it is not included, the API is served directly under the host. The value MUST start with a leading slash (/). The basePath does not support path [path templating](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#pathTemplating).
   */
  basePath?: string;
  /**
   * The transfer protocol of the API. Values MUST be from the list: `http`, `https`, `ws`, `wss`. If the schemes is not included, the default scheme to be used is the one used to access the Swagger definition itself.
   */
  schemes?: ("http" | "https" | "ws" | "wss")[];
  /**
   * A list of MIME types the APIs can consume. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under [Mime Types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#mimeTypes).
   */
  consumes?: string[];
  /**
   * A list of MIME types the APIs can produce. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under [Mime Types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#mimeTypes).
   */
  produces?: string[];
  /**
   * The available paths and operations for the API.
   */
  paths?: OpenSpecHash<OS2Paths>;
  /**
   * An object to hold data types produced and consumed by operations.
   */
  definitions?: OpenSpecHash<OS2Schema>;
  /**
   * An object to hold parameters that can be used across operations. This property does not define global parameters for all operations.
   */
  parameters?: OpenSpecHash<OS2BodyParameter | OS2QueryParameter>;
  /**
   * An object to hold responses that can be used across operations. This property does not define global responses for all operations.
   */
  responses?: OpenSpecHash<OS2Response>;
  /**
   * A declaration of which security schemes are applied for the API as a whole. The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements). Individual operations can override this definition.
   */
  security?: OpenSpecSecurity;
  /**
   * Security scheme definitions that can be used across the specification.
   */
  securityDefinitions?: OpenSpecHash<OS2Security>;
  /**
   * A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags that are not declared may be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
   */
  tags?: OpenSpecTag[];
  /**
   * Additional external documentation.
   */
  externalDocs?: OpenSpecExternalDocs;
}
