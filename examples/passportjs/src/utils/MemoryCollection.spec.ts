import {expect} from "chai";
import {MemoryCollection} from "./MemoryCollection";

class MyModel {
  _id: string;
  prop: string;
}

class MyService extends MemoryCollection<MyModel> {
  constructor() {
    super(MyModel, [
      {prop: "test"},
      {prop: "test2"},
      {prop: "test"},
      {prop: "test2"}
    ]);
  }
}

describe("MemoryCollection", () => {
  it("should load data", async () => {
    const service = new MyService();
    const item = await service.findOne({prop: "test"});

    expect(item!.prop).to.eq("test");
    expect(item!).to.be.instanceOf(MyModel);
  });

  it("should update data", async () => {
    const service = new MyService();
    const item: MyModel = (await service.findOne({prop: "test"}))!;
    const item2: MyModel = (await service.findOne({prop: "test"}))!;

    item.prop = "test3";

    const updateItem = await service.update(item);

    expect(updateItem!.prop).to.eq("test3");
    expect(item2!.prop).to.eq("test");
  });

  it("shouldn't update data", async () => {
    const service = new MyService();
    const updateItem = await service.update({_id: "=======", prop: "test"});

    expect(updateItem).to.eq(undefined);
  });

  it("should return all data", async () => {
    const service = new MyService();
    const items = await service.findAll();

    expect(items.length).to.equal(4);
  });

  it("should return filtered data", async () => {
    const service = new MyService();
    const items = await service.findAll({prop: "test"});

    expect(items.length).to.equal(2);
  });

  it("should remove data", async () => {
    const service = new MyService();

    const item = await service.removeOne({prop: "test"});
    const items = await service.findAll();

    expect(item!.prop).to.eq("test");
    expect(items.length).to.eq(3);
  });

  it("should remove all matching data", async () => {
    const service = new MyService();

    const removedItems = await service.removeAll({prop: "test"});
    const items = await service.findAll();

    expect(removedItems.length).to.eq(2);
    expect(items.length).to.eq(2);
  });

  it("shouldn't find data", async () => {
    const service = new MyService();
    const item = await service.findOne({prop: "test===="});

    expect(item).to.eq(undefined);
  });
});
