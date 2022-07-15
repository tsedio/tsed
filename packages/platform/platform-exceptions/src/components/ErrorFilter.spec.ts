import {ErrorFilter} from "./ErrorFilter";

describe("ErrorFilter", () => {
  it("should map error if error.errors is an object", () => {
    const error = {
      errors: {
        "ingredients.0.product": {
          stringValue:
            "\"{\n  id: '5e9a0c1d5575346932e090f0',\n  label: 'Artichauts',\n  shelf: 'produce',\n  minimumQuantity: 0,\n  users: []\n}\"",
          kind: "ObjectId",
          value: {
            id: "5e9a0c1d5575346932e090f0",
            label: "Artichauts",
            shelf: "produce",
            minimumQuantity: 0,
            users: []
          },
          path: "product",
          reason: {}
        }
      },
      _message: "Recipe validation failed",
      name: "ValidationError",
      message:
        "Recipe validation failed: ingredients.0.product: Cast to ObjectId failed for value \"{\n  id: '5e9a0c1d5575346932e090f0',\n  label: 'Artichauts',\n  shelf: 'produce',\n  minimumQuantity: 0,\n  users: []\n}\" at path \"product\""
    };
    const errorFilterInstance = new ErrorFilter();
    expect(errorFilterInstance.mapError(error).errors).toEqual([error.errors]);
  });
});
