import {getFormioSchema} from "@tsed/schema-formio";
import {Property} from "@tsed/schema";
import {Form} from "../decorators/form";
import {getJsonEntityStore, isJsonEntityStore} from "@tsed/schema/src/utils/getJsonEntityStore";

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
  it("should return undefined when the schema is unknown", () => {
    expect(getFormioSchema("unknown")).toEqual(undefined);
  });

  it("should return schema by his machineName", () => {
    @Form()
    class Model {
      @Property()
      test: string;
    }

    expect(getFormioSchema("model")).toEqual(schema);
    expect(getFormioSchema("Model")).toEqual(schema);
  });

  it("should return schema by his custom machine name", () => {
    @Form({name: "CustomModel"})
    class Model {
      @Property()
      test: string;
    }

    expect(getFormioSchema("custom-model")).toEqual({
      ...schema,
      machineName: "custom-model",
      name: "custom-model",
      title: "CustomModel"
    });
    expect(getFormioSchema("CustomModel")).toEqual({
      ...schema,
      machineName: "custom-model",
      name: "custom-model",
      title: "CustomModel"
    });
  });

  it("should return schema by his type", () => {
    @Form()
    class Model {
      @Property()
      test: string;
    }

    expect(getFormioSchema(Model)).toEqual(schema);
  });
  it("should return schema by his store", () => {
    @Form()
    class Model {
      @Property()
      test: string;
    }

    expect(getFormioSchema(getJsonEntityStore(Model))).toEqual(schema);
  });
});
