import type {EntityManager} from "@mikro-orm/core";
import {Injectable} from "@tsed/di";

import type {AfterTransactionCommit, BeforeTransactionCommit} from "../../../src/index.js";

@Injectable()
export class Hooks implements AfterTransactionCommit, BeforeTransactionCommit {
  $afterTransactionCommit(em: EntityManager): Promise<unknown> | unknown {
    return Promise.resolve();
  }

  $beforeTransactionCommit(em: EntityManager): Promise<unknown> | unknown {
    return Promise.resolve();
  }
}
