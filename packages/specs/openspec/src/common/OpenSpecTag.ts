import {OpenSpecExternalDocs} from "./OpenSpecExternalDocs";

export interface OpenSpecTag {
  name: string;
  description?: string;
  externalDocs?: OpenSpecExternalDocs;
}
