import {Inject, Injectable} from "@tsed/di";
import {MongooseModel} from "@tsed/mongoose";

import {MyModel} from "./models/MyModel";

@Injectable()
export class MyRepository {
  @Inject(MyModel) private model: MongooseModel<MyModel>;

  async save(obj: MyModel): Promise<MongooseModel<MyModel>> {
    const doc = new this.model(obj);
    await doc.save();

    return doc;
  }

  async find(query: any) {
    const list = await this.model.find(query).exec();

    console.log(list);

    return list;
  }
}
