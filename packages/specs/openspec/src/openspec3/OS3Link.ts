import type {OpenSpecHash} from "../common/OpenSpecHash.js";
import type {OS3Server} from "./OS3Server.js";

export interface OS3Link {
  /**
   * A relative or absolute reference to an OAS operation. This field is mutually exclusive of the operationId field, and MUST point to an Operation Object. Relative operationRef values MAY be used to locate an existing Operation Object in the OpenAPI definition.
   */
  operationRef?: string;
  /**
   * The name of an existing, resolvable OAS operation, as defined with a unique operationId. This field is mutually exclusive of the operationRef field.
   */
  operationId?: string;
  /**
   * A map representing parameters to pass to an operation as specified with operationId or identified via operationRef. The key is the parameter name to be used, whereas the value can be a constant or an expression to be evaluated and passed to the linked operation. The parameter name can be qualified using the parameter location [{in}.]{name} for operations that use the same [parameter name](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#parameterIn) in different locations (e.g. path.id).
   */
  parameters?: OpenSpecHash<any>;
  /**
   * A description of the link. CommonMark syntax MAY be used for rich text representation.
   */
  description?: string;
  /**
   * A server object to be used by the target operation.
   */
  server?: OS3Server;
}
