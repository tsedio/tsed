import {nameOf} from "@tsed/core";
import {Configuration, Injectable, Opts, ProviderScope, Scope} from "@tsed/di";
import fs from "fs-extra";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";
import {dirname} from "path";

import type {AdapterConstructorOptions} from "../domain/Adapter.js";
import type {AdapterModel} from "./LowDbAdapter.js";
import {LowDbAdapter} from "./LowDbAdapter.js";

export interface FileSyncAdapterConstructorOptions extends AdapterConstructorOptions {
  readOnly: true;
}

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class FileSyncAdapter<T extends AdapterModel> extends LowDbAdapter<T> {
  constructor(@Opts options: FileSyncAdapterConstructorOptions, @Configuration() configuration: Configuration) {
    super(options, configuration);

    fs.ensureDirSync(dirname(this.dbFilePath));

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
