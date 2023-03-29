import {EventSubscriber, TransactionEventArgs} from "@mikro-orm/core";
import {$log} from "@tsed/logger";

export class SimpleSubscriber implements EventSubscriber {
  public async afterFlush(_: TransactionEventArgs): Promise<void> {
    $log.info("Changes has been flushed.");
  }
}
