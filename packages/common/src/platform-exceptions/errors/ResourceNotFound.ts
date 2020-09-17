import {NotFound} from "@tsed/exceptions";

export class ResourceNotFound extends NotFound {
  readonly url: string;

  constructor(url: string) {
    super(`Resource "${url}" not found`);

    this.url = url;
  }
}
