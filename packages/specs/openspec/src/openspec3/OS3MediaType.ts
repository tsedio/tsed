import {OpenSpecHash} from "../common/OpenSpecHash.js";
import {OpenSpecRef} from "../common/OpenSpecRef.js";
import {OS3Encoding} from "./OS3Encoding.js";
import {OS3Example} from "./OS3Example.js";
import {OS3Schema} from "./OS3Schema.js";

export interface OS3MediaType<Schema = OS3Schema> {
  /**
   * The schema defining the type used for the request body.
   */
  schema?: Schema | OpenSpecRef;
  /**
   * Example of the media type. The example object SHOULD be in the correct format as specified by the media type. The example field is mutually exclusive of the examples field. Furthermore, if referencing a schema which contains an example, the example value SHALL override the example provided by the schema.
   */
  example?: any;
  /**
   * Examples of the media type. Each example object SHOULD match the media type and specified schema if present. The examples field is mutually exclusive of the example field. Furthermore, if referencing a schema which contains an example, the examples value SHALL override the example provided by the schema.
   */
  examples?: OpenSpecHash<OS3Example | OpenSpecRef>;
  /**
   * A map between a property name and its encoding information. The key, being the property name, MUST exist in the schema as a property. The encoding object SHALL only apply to requestBody objects when the media type is `multipart` or `application/x-www-form-urlencoded`.
   */
  encoding?: OpenSpecHash<OS3Encoding>;
}
