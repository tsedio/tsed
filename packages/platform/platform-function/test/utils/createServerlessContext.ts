import {JsonEntityStore} from "@tsed/schema";
import {createFakeContext, createFakeEvent, PlatformServerlessTest} from "@tsed/platform-serverless-testing";
import {Logger} from "@tsed/logger";
import {PlatformContext} from "../../src/domain/PlatformContext";

export function createServerlessContext({endpoint}: {endpoint: JsonEntityStore}) {
  const context: any = createFakeContext();
  const event: any = createFakeEvent();

  return new PlatformContext({
    event,
    context,
    id: context.awsRequestId,
    logger: PlatformServerlessTest.injector.logger as Logger,
    injector: PlatformServerlessTest.injector,
    endpoint
  });
}
