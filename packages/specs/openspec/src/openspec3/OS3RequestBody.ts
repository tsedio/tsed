import {OS3Schema} from "./OS3Schema";
import {OpenSpecHash} from "../common/OpenSpecHash";
import {OS3MediaType} from "./OS3MediaType";

export interface OS3RequestBody<Schema = OS3Schema> {
  /**
   * A brief description of the request body. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.
   */
  description?: string;
  /**
   * A map containing descriptions of potential request body. The key is a media type or [media type range](https://tools.ietf.org/html/rfc7231#appendix-D) and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
   */
  content?: OpenSpecHash<OS3MediaType<Schema>>;
  /**
   * Determines if the request body is required in the request. Defaults to false.
   */
  required?: boolean;
}
