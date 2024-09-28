import {EventSubscriber, TransactionEventArgs} from "@mikro-orm/core";
import {Inject} from "@tsed/di";
import {$log, Logger} from "@tsed/logger";

export class UnmanagedEventSubscriber2 implements EventSubscriber {
  @Inject()
  private readonly logger: Logger;

  public afterFlush(_: TransactionEventArgs): Promise<void> {
    $log.info("Changes has been flushed.");
    return Promise.resolve();
  }
}
