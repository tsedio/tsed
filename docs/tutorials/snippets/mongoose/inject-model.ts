import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {MyModel} from "./models/MyModel";

@Service()
export class MyService {
  constructor(@Inject(MyModel) private model: MongooseModel<MyModel>) {
    console.log(model); // Mongoose.model class
  }

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
