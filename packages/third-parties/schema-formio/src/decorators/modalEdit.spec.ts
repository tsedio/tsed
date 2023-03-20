import {getFormioSchema} from "../utils/getFormioSchema";
import {ModalEdit} from "./modalEdit";

describe("@ModalEdit", () => {
  it("should transform field to editable modal", async () => {
    class Model {
      @ModalEdit()
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
      access: [],
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          label: "Test",
          modalEdit: true,
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
    });
  });
});
