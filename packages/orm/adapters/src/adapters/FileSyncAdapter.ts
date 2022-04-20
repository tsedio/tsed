import {nameOf} from "@tsed/core";
import {Configuration, Injectable, Opts, ProviderScope, Scope} from "@tsed/di";
import {ensureDirSync} from "fs-extra";
import {JSONFileSync, LowSync } from "lowdb";
import {dirname} from "path";
import {AdapterConstructorOptions} from "../domain/Adapter";
import {AdapterModel, LowDbAdapter, LowModel} from "./LowDbAdapter";

export interface FileSyncAdapterConstructorOptions extends AdapterConstructorOptions {
  readOnly: true;
}

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class FileSyncAdapter<T extends AdapterModel> extends LowDbAdapter<T> {
  constructor(@Opts options: FileSyncAdapterConstructorOptions, @Configuration() configuration: Configuration) {
    super(options, configuration);

    ensureDirSync(dirname(this.dbFilePath));

    const file = new JSONFileSync<LowModel<T>>(this.dbFilePath);

    this.db = new LowSync<LowModel<T>>(file);
    this.db.data ||= {
      collectionName: this.collectionName,
      modelName: nameOf(this.model),
      collection: []
    };
    this.db.write();

    if (options.readOnly) {
      file.write = (() => {}) as any;
    }
  }
}
