import {LocalsContainer} from "@tsed/di";
import {EndpointMetadata} from "./EndpointMetadata";

export class Context extends Map<any, any> {
  readonly id: string;
  readonly dateStart: Date = new Date();
  public data: any;
  public endpoint: EndpointMetadata;
  // public auth: any; // TODO Add Auth token support
  private _container = new LocalsContainer();

  [key: string]: any;

  constructor({id}: {id: string}) {
    super();
    this.id = id;
  }

  get container(): Map<string, any> {
    return this._container;
  }

  destroy() {
    this._container.forEach((instance: any) => {
      /* istanbul ignore next */
      if (instance.$onDestroy) {
        instance.$onDestroy();
      }
    });

    delete this._container;
  }
}
