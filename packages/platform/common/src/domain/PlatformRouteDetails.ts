import {ParamMetadata, ParamTypes} from "@tsed/platform-params";
import {JsonOperationRoute} from "@tsed/schema";
import {EndpointMetadata} from "./EndpointMetadata";
import {ControllerProvider} from "./ControllerProvider";

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
    this.rawBody = !!this.endpoint.parameters.find((param: ParamMetadata) => param.paramType === ParamTypes.RAW_BODY);
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
