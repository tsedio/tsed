import {JsonEntityStore, Property} from "@tsed/schema";

import {Form} from "../decorators/form.js";
import {getFormioSchema} from "../utils/getFormioSchema.js";

const schema = {
  access: [],
  components: [
    {
      disabled: false,
      input: true,
      key: "test",
      label: "Test",
      type: "textfield",
      validate: {
        required: false
      }
    }
  ],
  display: "form",
  machineName: "model",
  name: "model",
  submissionAccess: [],
  tags: [],
  title: "Model",
  type: "form"
};

describe("getFormioSchema", () => {
  it("should return undefined when the schema is unknown", async () => {
    expect(await getFormioSchema("unknown")).toEqual(undefined);
  });

  it("should return schema by his machineName", async () => {
    @Form()
    class Model {
      @Property()
      test: string;
    }

    expect(await getFormioSchema("model")).toEqual(schema);
    expect(await getFormioSchema("Model")).toEqual(schema);
  });

  it("should return schema by his custom machine name", async () => {
    @Form({name: "CustomModel"})
    class Model {
      @Property()
      test: string;
    }

    expect(await getFormioSchema("custom-model")).toEqual({
      ...schema,
      machineName: "custom-model",
      name: "custom-model",
      title: "CustomModel"
    });
    expect(await getFormioSchema("CustomModel")).toEqual({
      ...schema,
      machineName: "custom-model",
      name: "custom-model",
      title: "CustomModel"
    });
  });

  it("should return schema by his type", async () => {
    @Form()
    class Model {
      @Property()
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual(schema);
  });
  it("should return schema by his store", async () => {
    @Form()
    class Model {
      @Property()
      test: string;
    }

    expect(await getFormioSchema(JsonEntityStore.from(Model))).toEqual(schema);
  });
});
