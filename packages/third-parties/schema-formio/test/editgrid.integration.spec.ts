import {CollectionOf, MaxItems, MinItems, Property} from "@tsed/schema";

import {OpenWhenEmpty} from "../src/decorators/openWhenEmpty.js";
import {getFormioSchema} from "../src/index.js";

describe("EditGrid integration", () => {
  it("should generate form", async () => {
    class Nested {
      @Property()
      id: string;
    }

    class Model {
      @CollectionOf(Nested)
      test: Nested[];
    }

    expect(await getFormioSchema(Model)).toEqual({
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
      tags: []
    });
  });
  it("should generate form with minItems/maxItems", async () => {
    class Nested {
      @Property()
      id: string;
    }

    class Model {
      @CollectionOf(Nested)
      @MinItems(1)
      @MaxItems(10)
      test: Nested[];
    }

    expect(await getFormioSchema(Model)).toMatchSnapshot();
  });
  it("should generate form with openWhenEmpty", async () => {
    class Nested {
      @Property()
      id: string;
    }

    class Model {
      @CollectionOf(Nested)
      @OpenWhenEmpty()
      test: Nested[];
    }

    expect(await getFormioSchema(Model)).toEqual({
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
          openWhenEmpty: true,
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
      tags: []
    });
  });
  it("should generate form with openWhenEmpty = false", async () => {
    class Nested {
      @Property()
      id: string;
    }

    class Model {
      @CollectionOf(Nested)
      @OpenWhenEmpty(false)
      test: Nested[];
    }

    expect(await getFormioSchema(Model)).toEqual({
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
          openWhenEmpty: false,
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
      tags: []
    });
  });
});
