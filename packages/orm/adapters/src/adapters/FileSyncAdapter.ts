import {nameOf} from "@tsed/core";
import {Configuration, Injectable, Opts, ProviderScope, Scope} from "@tsed/di";
import {ensureDirSync} from "fs-extra";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import {dirname} from "path";
import {AdapterConstructorOptions} from "../domain/Adapter";
import {AdapterModel, LowDbAdapter} from "./LowDbAdapter";

export interface FileSyncAdapterConstructorOptions extends AdapterConstructorOptions {
  readOnly: true;
}

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class FileSyncAdapter<T extends AdapterModel> extends LowDbAdapter<T> {
  constructor(@Opts options: FileSyncAdapterConstructorOptions, @Configuration() configuration: Configuration) {
    super(options, configuration);

    ensureDirSync(dirname(this.dbFilePath));

    const file = new FileSync<{collection: T[]}>(this.dbFilePath);

    this.db = low(file);
    this.db
      .defaults({
        collectionName: this.collectionName,
        modelName: nameOf(this.model),
        collection: []
      })
      .write();

    if (options.readOnly) {
      file.write = () => {};
    }
  }
}