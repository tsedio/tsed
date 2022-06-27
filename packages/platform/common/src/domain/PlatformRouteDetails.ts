import {ParamTypes} from "@tsed/platform-params";
import {EndpointMetadata, JsonOperationRoute} from "@tsed/schema";
import {ControllerProvider} from "./ControllerProvider";

export class PlatformRouteDetails extends JsonOperationRoute<EndpointMetadata> {
  readonly rawBody: boolean;
  readonly provider: ControllerProvider;

  constructor(options: Partial<PlatformRouteDetails>) {
    super(options);
    this.rawBody = !!this.endpoint.parameters.find((param) => param.paramType === ParamTypes.RAW_BODY);
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
