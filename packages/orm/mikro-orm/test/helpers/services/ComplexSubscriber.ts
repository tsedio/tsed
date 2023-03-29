import {EventSubscriber, TransactionEventArgs} from "@mikro-orm/core";
import {Inject} from "@tsed/di";
import {Logger} from "@tsed/logger";

export class ComplexSubscriber implements EventSubscriber {
  constructor(@Inject() private readonly logger: Logger) {}

  public async afterFlush(_: TransactionEventArgs): Promise<void> {
    this.logger.info("Changes has been flushed.");
  }
}
