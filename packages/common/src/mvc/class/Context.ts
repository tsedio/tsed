import {LocalsContainer} from "@tsed/di";
import {EndpointMetadata} from "./EndpointMetadata";

export class Context extends Map<any, any> {
  readonly id: string;
  readonly dateStart: Date = new Date();
  readonly container = new LocalsContainer<any>();
  public endpoint: EndpointMetadata;
  public data: any;

  [key: string]: any;

  constructor({id}: {id: string}) {
    super();
    this.id = id;
  }

  async destroy() {
    await this.container.destroy();
  }
}
