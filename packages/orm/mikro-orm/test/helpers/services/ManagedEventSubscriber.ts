import {EventSubscriber, TransactionEventArgs} from "@mikro-orm/core";
import {Inject} from "@tsed/di";
import {Logger} from "@tsed/logger";

import {Subscriber} from "../../../src/index.js";

@Subscriber()
export class ManagedEventSubscriber implements EventSubscriber {
  constructor(@Inject() private readonly logger: Logger) {}

  public afterFlush(_: TransactionEventArgs): Promise<void> {
    this.logger.info("Changes has been flushed.");
    return Promise.resolve();
  }
}
