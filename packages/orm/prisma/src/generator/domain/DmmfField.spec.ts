import {DmmfField} from "./DmmfField.js";
import {DmmfModel} from "./DmmfModel.js";

describe("DmmfField", () => {
  it("should create a new instance of DmmfField", () => {
    const dmmfField = new DmmfField({
      field: {
        name: "name",
        isRequired: true,
        type: "string",
        isList: false,
        kind: "scalar"
      },
      schemaArg: {
        isNullable: false
      },
      model: new DmmfModel({
        model: {
          name: "model",
          fields: []
        },
        modelType: {
          fields: []
        },
        isInputType: true
      })
    });

    expect(dmmfField).toBeInstanceOf(DmmfField);
    expect(dmmfField.name).toBe("name");
    expect(dmmfField.isRequired).toBe(true);
    expect(dmmfField.type).toBe("string");
    expect(dmmfField.isList).toBe(false);
    expect(dmmfField.kind).toBe("scalar");
    expect(dmmfField.isNullable).toBe(false);
    expect(dmmfField.location).toBe("scalar");
    expect(dmmfField.getAdditionalDecorators()).toEqual([]);
    expect(dmmfField.toString()).toBe("name");
  });
});
