import {OpenSpecHash} from "../common/OpenSpecHash.js";
import {OpenSpecRef} from "../common/OpenSpecRef.js";
import {OS3Header} from "./OS3Header.js";
import {OS3Link} from "./OS3Link.js";
import {OS3MediaType} from "./OS3MediaType.js";
import {OS3Schema} from "./OS3Schema.js";

export interface OS3Response<Schema = OS3Schema, Header = OS3Header<Schema>> {
  /**
   * A short description of the response. CommonMark syntax MAY be used for rich text representation.
   */
  description: string;
  /**
   * Maps a header name to its definition. [RFC7230](https://tools.ietf.org/html/rfc7230#page-22) states header names are case insensitive. If a response header is defined with the name "Content-Type", it SHALL be ignored.
   */
  headers?: OpenSpecHash<Header>;
  /**
   * A map containing descriptions of potential response payloads. The key is a media type or [media type range](https://tools.ietf.org/html/rfc7231#appendix-D) and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
   */
  content?: OpenSpecHash<OS3MediaType<Schema>>;
  /**
   * A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for [Component Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#componentsObject).
   */
  links?: OpenSpecHash<OS3Link | OpenSpecRef>;
}
