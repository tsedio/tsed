import {CollectionOf, Property} from "@tsed/schema";
import {Currency, getFormioSchema} from "../src";


describe('EditGrid integration', () => {
  it("should generate form", () => {
    class Nested {
      @Property()
      id: string;
    }
    class Model {
      @Currency()
      @CollectionOf(Nested)
      test: Nested[];
    }

    expect(getFormioSchema(Model)).toEqual({
      components: [
        {
          components: [
            {
              disabled: false,
              input: true,
              key: "id",
              label: "Id",
              type: "textfield",
              validate: {
                required: false
              }
            }
          ],
          disabled: false,
          input: true,
          key: "test",
          label: "Test",
          rowDrafts: false,
          type: "editgrid",
          validate: {
            required: false
          }
        }
      ],
      display: "form",
      machineName: "model",
      name: "model",
      title: "Model",
      type: "form",
      submissionAccess: [],
      access: [],
      tags: [],
    });
  });
})
