import {EventSubscriber, TransactionEventArgs} from "@mikro-orm/core";
import {Inject} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {Subscriber} from "../../../src";

@Subscriber()
export class EventSubscriber1 implements EventSubscriber {
  constructor(@Inject() private readonly logger: Logger) {}

  public async afterFlush(_: TransactionEventArgs): Promise<void> {
    this.logger.info("Changes has been flushed.");
  }
}
