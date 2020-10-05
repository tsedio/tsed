import {HeaderParams, UsePipe} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {Description} from "@tsed/schema";
import {ParseApiGatewayPipe} from "../pipes/ParseApiGatewayPipe";

/**
 * Return the decoded x-apigateway-context
 * @decorator
 */
export function AwsContext(): ParameterDecorator {
  return useDecorators(
    HeaderParams({
      expression: "x-apigateway-context",
      useConverter: false,
      useType: String,
      useValidation: false
    }),
    Description("x-apigateway-context serialized Json"),
    UsePipe(ParseApiGatewayPipe)
  );
}
