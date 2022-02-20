import {OpenSpecExternalDocs} from "../common/OpenSpecExternalDocs";
import {OpenSpecRef} from "../common/OpenSpecRef";
import {OS3Schema} from "./OS3Schema";

export interface OS3Header<Schema = OS3Schema> {
  /**
   * A description of the header. CommonMark syntax MAY be used for rich text representation.
   */
  description?: string;
  /**
   * The schema defining the type used for the header.
   */
  schema?: Schema | OpenSpecRef;
  /**
   * Additional external documentation for this tag.
   */
  externalDocs?: OpenSpecExternalDocs;
}
