import {ParamTypes} from "@tsed/platform-params";
import {EndpointMetadata} from "../../mvc/models/EndpointMetadata";
import {ControllerProvider} from "./ControllerProvider";

export interface PlatformRouterDetailsOptions {
  provider: ControllerProvider;
  endpoint: EndpointMetadata;
  method: string;
  url: string;
}

export class PlatformRouteDetails {
  readonly method: string;
  readonly url: string;
  readonly rawBody: boolean;
  readonly endpoint: EndpointMetadata;
  readonly provider: ControllerProvider;

  constructor({provider, endpoint, method, url}: PlatformRouterDetailsOptions) {
    this.provider = provider;
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
