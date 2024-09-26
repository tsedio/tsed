import type {EntityManager} from "@mikro-orm/core";

export interface AfterTransactionCommit {
  $afterTransactionCommit(em: EntityManager): Promise<unknown> | unknown;
}
