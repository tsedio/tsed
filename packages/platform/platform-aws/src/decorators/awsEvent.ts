import {HeaderParams, UsePipe} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {Description} from "@tsed/schema";
import {ParseApiGatewayPipe} from "../pipes/ParseApiGatewayPipe";

/**
 * Return the decoded x-apigateway-event
 * @decorator
 */
export function AwsEvent(): ParameterDecorator {
  return useDecorators(
    HeaderParams({
      expression: "x-apigateway-event",
      useConverter: false,
      useType: String,
      useValidation: false
    }),
    Description("x-apigateway-event serialized Json"),
    UsePipe(ParseApiGatewayPipe)
  );
}
