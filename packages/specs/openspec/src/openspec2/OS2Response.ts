import {OpenSpecHash} from "../common/OpenSpecHash.js";
import {OS2Header} from "./OS2Header.js";
import {OS2Schema} from "./OS2Schema.js";

export interface OS2Response {
  /**
   * A short description of the response. GFM syntax can be used for rich text representation.
   */
  description: string;
  /**
   * A definition of the response structure. It can be a primitive, an array or an object. If this field does not exist, it means no content is returned as part of the response. As an extension to the Schema Object, its root type value may also be "file". This SHOULD be accompanied by a relevant produces mime-type.
   */
  schema?: OS2Schema;
  /**
   * A list of headers that are sent with the response.
   */
  headers?: OpenSpecHash<OS2Header>;
  /**
   * An example of the response message.
   */
  examples?: OpenSpecHash<{}>;
}
