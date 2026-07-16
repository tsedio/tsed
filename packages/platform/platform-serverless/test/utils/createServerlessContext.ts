import {PlatformServerlessTest, createFakeContext, createFakeEvent} from "@tsed/platform-serverless-testing";
import {JsonEntityStore} from "@tsed/schema";
import {Logger} from "@tsed/logger";
import {ServerlessContext} from "../../src/domain/ServerlessContext.js";

export function createServerlessContext({
  endpoint,
  event: initialEvent,
  context: initialContext
}: {
  endpoint: JsonEntityStore;
  event?: Parameters<typeof createFakeEvent>[0];
  context?: Parameters<typeof createFakeContext>[0];
}) {
  const context: any = createFakeContext(initialContext);
  const event: any = createFakeEvent(initialEvent);

  return new ServerlessContext({
    event,
    context,
    id: context.awsRequestId,
    logger: PlatformServerlessTest.injector.logger as Logger,
    injector: PlatformServerlessTest.injector,
    endpoint
  });
}
