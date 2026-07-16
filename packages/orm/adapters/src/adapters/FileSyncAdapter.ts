import {AdapterModel, LowDbAdapter, type LowModel} from "./LowDbAdapter.js";
import {Injectable, Opts, ProviderScope, Scope} from "@tsed/di";
import {AdapterConstructorOptions} from "../domain/Adapter.js";
import {JSONFileSync} from "lowdb/node";
import {LowSync} from "lowdb";
import {dirname} from "node:path";
import fs from "fs-extra";
import {nameOf} from "@tsed/core";

export interface FileSyncAdapterConstructorOptions extends AdapterConstructorOptions {
  readOnly: true;
}

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class FileSyncAdapter<T extends AdapterModel> extends LowDbAdapter<T> {
  constructor(@Opts options: FileSyncAdapterConstructorOptions) {
    super(options);

    fs.ensureDirSync(dirname(this.dbFilePath));

    const file = new JSONFileSync<LowModel<T>>(this.dbFilePath);

    this.db = new LowSync<LowModel<T>>(file, {
      collectionName: this.collectionName,
      modelName: nameOf(this.model),
      collection: []
    });
    this.db.read();

    if (options.readOnly) {
      file.write = (() => {}) as any;
    }
  }
}
