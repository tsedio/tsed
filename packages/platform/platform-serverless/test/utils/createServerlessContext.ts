import {JsonEntityStore} from "@tsed/schema";
import {createFakeContext, createFakeEvent, PlatformServerlessTest} from "@tsed/platform-serverless-testing";
import {Logger} from "@tsed/logger";
import {ServerlessContext} from "../../src/domain/ServerlessContext";

export function createServerlessContext({endpoint}: {endpoint: JsonEntityStore}) {
  const context: any = createFakeContext();
  const event: any = createFakeEvent();

  return new ServerlessContext({
    event,
    context,
    id: context.awsRequestId,
    logger: PlatformServerlessTest.injector.logger as Logger,
    injector: PlatformServerlessTest.injector,
    endpoint
  });
}
