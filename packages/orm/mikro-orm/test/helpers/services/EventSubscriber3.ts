import {EventSubscriber, Subscriber, TransactionEventArgs} from "@mikro-orm/core";
import {Inject} from "@tsed/di";
import {Logger} from "@tsed/logger";

@Subscriber()
export class EventSubscriber1 implements EventSubscriber {
  // NOTE: In this case injection on constructor isn't possible the class is already built by @Subscriber
  @Inject()
  private readonly logger: Logger;

  public async afterFlush(_: TransactionEventArgs): Promise<void> {
    this.logger.info("Changes has been flushed.");
  }
}
