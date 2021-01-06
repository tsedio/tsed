import {pathToRegexp} from "path-to-regexp";
import {EndpointMetadata} from "../../mvc/models/EndpointMetadata";
import {ParamTypes} from "../../mvc/models/ParamTypes";

export class PlatformRouteDetails {
  readonly method: string;
  readonly url: string;
  readonly rawBody: boolean;
  readonly endpoint: EndpointMetadata;
  readonly matcher: RegExp;

  constructor({endpoint, method, url}: {endpoint: EndpointMetadata; method: string; url: string}) {
    this.endpoint = endpoint;
    this.method = method;
    this.url = url;
    this.rawBody = !!endpoint.params.find((param) => param.paramType === ParamTypes.RAW_BODY);
    this.matcher = pathToRegexp(this.url);
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

  match(url: string) {
    return url.match(this.matcher);
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
