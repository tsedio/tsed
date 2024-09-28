import {Configuration, Injectable, Opts, ProviderScope, Scope} from "@tsed/di";
import low from "lowdb";
import Memory from "lowdb/adapters/Memory.js";

import {AdapterModel, LowDbAdapter} from "./LowDbAdapter.js";

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class MemoryAdapter<T extends AdapterModel> extends LowDbAdapter<T> {
  constructor(@Opts options: any, @Configuration() configuration: Configuration) {
    super(options, configuration);

    this.db = low(new Memory<{collection: T[]}>(this.dbFilePath));
    this.db
      .defaults({
        collection: []
      })
      .write();
  }
}
