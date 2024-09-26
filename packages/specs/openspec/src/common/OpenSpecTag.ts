import type {OpenSpecExternalDocs} from "./OpenSpecExternalDocs.js";

export interface OpenSpecTag {
  name: string;
  description?: string;
  externalDocs?: OpenSpecExternalDocs;
}
