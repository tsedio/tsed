import {EventSubscriber, TransactionEventArgs} from "@mikro-orm/core";
import {$log, Logger} from "@tsed/logger";
import {Inject} from "@tsed/di";

export class UnmanagedEventSubscriber2 implements EventSubscriber {
  @Inject()
  private readonly logger: Logger;

  public afterFlush(_: TransactionEventArgs): Promise<void> {
    $log.info("Changes has been flushed.");
    return Promise.resolve();
  }
}
