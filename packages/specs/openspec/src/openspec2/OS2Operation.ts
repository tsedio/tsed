import {OpenSpecExternalDocs} from "../common/OpenSpecExternalDocs";
import {OpenSpecHash} from "../common/OpenSpecHash";
import {OpenSpecRef} from "../common/OpenSpecRef";
import {OpenSpecSecurity} from "../common/OpenSpecSecurity";
import {OS2Parameter} from "./OS2Parameter";
import {OS2Response} from "./OS2Response";

/**
 * @deprecated
 */
export interface OS2Operation {
  /**
   * A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.
   */
  tags?: string[];
  /**
   * A short summary of what the operation does. For maximum readability in the swagger-ui, this field SHOULD be less than 120 characters.
   */
  summary?: string;
  /**
   * A verbose explanation of the operation behavior. GFM syntax can be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this operation.
   */
  externalDocs?: OpenSpecExternalDocs;
  /**
   * Unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is recommended to follow common programming naming conventions.
   */
  operationId?: string;
  /**
   * A list of MIME types the operation can consume. This overrides the consumes definition at the Swagger Object. An empty value MAY be used to clear the global definition. Value MUST be as described under [Mime Types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#mimeTypes).
   */
  consumes?: string[];
  /**
   * A list of MIME types the operation can produce. This overrides the produces definition at the Swagger Object. An empty value MAY be used to clear the global definition. Value MUST be as described under [Mime Types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#mimeTypes).
   */
  produces?: string[];
  /**
   * A list of parameters that are applicable for this operation.
   * If a parameter is already defined at the [Path Item](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#pathItemParameters),
   * the new definition will override it, but can never remove it. The list MUST NOT include duplicated parameters.
   * A unique parameter is defined by a combination of a [name](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterName) and (location)[https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterIn].
   * The list can use the [Reference Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#referenceObject) to link to parameters that are defined at the [Swagger Object's parameters](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#swaggerParameters).
   * There can be one "body" parameter at most.
   */
  parameters?: (OS2Parameter | OpenSpecRef)[];
  /**
   * The list of possible responses as they are returned from executing this operation.
   */
  responses: OpenSpecHash<OS2Response | OpenSpecRef>;
  /**
   * The transfer protocol of the API. Values MUST be from the list: `http`, `https`, `ws`, `wss`. If the schemes is not included, the default scheme to be used is the one used to access the Swagger definition itself.
   */
  schemes?: string[];
  /**
   * Declares this operation to be deprecated. Usage of the declared operation should be refrained. Default value is false.
   */
  deprecated?: boolean;
  /**
   * A declaration of which security schemes are applied for this operation.
   * The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements).
   * This definition overrides any declared top-level [security](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#swaggerSecurity).
   * To remove a top-level security declaration, an empty array can be used.
   */
  security?: OpenSpecSecurity;
}
