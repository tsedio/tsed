import {getFormioSchema} from "@tsed/schema-formio";
import {expect} from "chai";
import {Password} from "./password";

describe("Password", () => {
  it("should declare a model with password field", () => {
    class Model {
      @Password()
      test: string;
    }

    expect(getFormioSchema(Model)).to.deep.eq({
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          label: "Test",
          protected: true,
          type: "password",
          validate: {
            required: false
          }
        }
      ],
      display: "form",
      machineName: "model",
      name: "model",
      title: "Model",
      type: "form"
    });
  });
});
