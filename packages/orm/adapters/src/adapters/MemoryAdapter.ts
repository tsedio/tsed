import {Configuration, Injectable, Opts, ProviderScope, Scope} from "@tsed/di";
import {Low, Memory} from "lowdb";

import {AdapterModel, LowDbAdapter} from "./LowDbAdapter.js";

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class MemoryAdapter<T extends AdapterModel> extends LowDbAdapter<T> {
  constructor(@Opts options: any, @Configuration() configuration: Configuration) {
    super(options, configuration);

    this.db = new Low(new Memory(), {
      collection: []
    });
  }

  $onInit() {
    return this.db.write();
  }
}
