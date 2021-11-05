import {ParamTypes} from "@tsed/platform-params";
import {EndpointMetadata} from "./EndpointMetadata";
import {ControllerProvider} from "./ControllerProvider";
import {JsonOperationRoute} from "@tsed/schema";

export interface PlatformRouterDetailsOptions {
  provider: ControllerProvider;
  endpoint: EndpointMetadata;
  method: string;
  url: string;
}

export class PlatformRouteDetails extends JsonOperationRoute<EndpointMetadata> {
  readonly rawBody: boolean;
  readonly provider: ControllerProvider;

  constructor(options: Partial<PlatformRouteDetails> = {}) {
    super(options);
    this.rawBody = !!this.endpoint.params.find((param) => param.paramType === ParamTypes.RAW_BODY);
  }

  get url() {
    return this.fullPath;
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
