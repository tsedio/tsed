import {EntityManager} from "@mikro-orm/core";

export interface BeforeTransactionCommit {
  $beforeTransactionCommit(em: EntityManager): Promise<unknown> | unknown;
}
