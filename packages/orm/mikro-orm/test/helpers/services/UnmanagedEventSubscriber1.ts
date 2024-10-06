import {EventSubscriber, TransactionEventArgs} from "@mikro-orm/core";
import {Inject} from "@tsed/di";
import {$log, Logger} from "@tsed/logger";

export class UnmanagedEventSubscriber1 implements EventSubscriber {
  constructor(@Inject() private readonly logger: Logger) {}

  public afterFlush(_: TransactionEventArgs): Promise<void> {
    $log.info("Changes has been flushed.");
    return Promise.resolve();
  }
}
