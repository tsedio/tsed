import {nameOf} from "@tsed/core";
import {Configuration, Injectable, Opts, ProviderScope, Scope} from "@tsed/di";
import {ensureDirSync} from "fs-extra";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import {dirname} from "path";
import {AdapterModel, LowDbAdapter} from "./LowDbAdapter";

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class FileSyncAdapter<T extends AdapterModel> extends LowDbAdapter<T> {
  constructor(@Opts options: any, @Configuration() configuration: Configuration) {
    super(options, configuration);

    ensureDirSync(dirname(this.dbFilePath));

    this.db = low(new FileSync<{collection: T[]}>(this.dbFilePath));
    this.db
      .defaults({
        collectionName: this.collectionName,
        modelName: nameOf(this.model),
        collection: []
      })
      .write();
  }
}
