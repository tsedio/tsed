import {EndpointMetadata} from "../../mvc/models/EndpointMetadata";
import {ParamTypes} from "../../mvc/models/ParamTypes";

export class PlatformRouteDetails {
  readonly method: string;
  readonly url: string;
  readonly rawBody: boolean;
  readonly endpoint: EndpointMetadata;

  constructor({endpoint, method, url}: {endpoint: EndpointMetadata; method: string; url: string}) {
    this.endpoint = endpoint;
    this.method = method;
    this.url = url;
    this.rawBody = !!endpoint.params.find((param) => param.paramType === ParamTypes.RAW_BODY);
  }

  get name() {
    return `${this.endpoint.targetName}.${this.methodClassName}()`;
  }

  get className() {
    return this.endpoint.targetName;
  }

  get methodClassName() {
    return String(this.endpoint.propertyKey);
  }

  get parameters() {
    return this.endpoint.params;
  }

  toJSON() {
    return {
      method: this.method,
      name: this.name,
      url: this.url,
      className: this.className,
      methodClassName: this.methodClassName,
      parameters: this.parameters,
      rawBody: this.rawBody
    };
  }
}
