import {OpenSpecHash} from "../common/OpenSpecHash.js";
import {OS3Callbacks} from "./OS3Callbacks.js";
import {OS3Example} from "./OS3Example.js";
import {OS3Header} from "./OS3Header.js";
import {OS3Link} from "./OS3Link.js";
import {OS3Parameter} from "./OS3Parameter.js";
import {OS3RequestBody} from "./OS3RequestBody.js";
import {OS3Response} from "./OS3Response.js";
import {OS3Schema} from "./OS3Schema.js";
import {OS3Security} from "./OS3Security.js";

export interface OS3Components<Schema = OS3Schema> {
  /**
   * An object to hold reusable [Schema Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#schemaObject).
   */
  schemas?: OpenSpecHash<Schema>;
  /**
   * An object to hold reusable [Response Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#responseObject).
   */
  responses?: OpenSpecHash<OS3Response<Schema>>;
  /**
   * An object to hold reusable [Parameter Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#parameterObject).
   */
  parameters?: OpenSpecHash<OS3Parameter<Schema>>;
  /**
   * An object to hold reusable [Example Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#exampleObject).
   */
  examples?: OpenSpecHash<OS3Example>;
  /**
   * An object to hold reusable [Request Body Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#requestBodyObject).
   */
  requestBodies?: OpenSpecHash<OS3RequestBody<Schema>>;
  /**
   * An object to hold reusable [Header Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#headerObject).
   */
  headers?: OpenSpecHash<OS3Header<Schema>>;
  /**
   * An object to hold reusable [Security Scheme Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#securitySchemeObject).
   */
  securitySchemes?: OpenSpecHash<OS3Security>;
  /**
   * An object to hold reusable [Link Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#linkObject).
   */
  links?: OpenSpecHash<OS3Link>;
  /**
   * An object to hold reusable [Callback Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#callbackObject).
   */
  callbacks?: OS3Callbacks;
}
