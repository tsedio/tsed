import {CollectionOf, Generics} from "@tsed/schema";
import {DocumentLink} from "./DocumentLink";

@Generics("T")
export class Document<T> {
  @CollectionOf("T")
  data: T;

  @CollectionOf(DocumentLink)
  links: DocumentLink[];

  constructor(options: Partial<Document<T>>) {
    options.data && (this.data = options.data);
    options.links && (this.links = options.links);
  }
}
