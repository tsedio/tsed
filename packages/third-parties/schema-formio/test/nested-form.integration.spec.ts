import {Property} from "@tsed/schema";
import {Currency, getFormioSchema, Hidden, Textarea} from "../src";


describe("Nested form integration", () => {
  it("should generate form and nested form", () => {
    class Price {
      @Currency()
      amount: number;
    }

    class Product {
      @Hidden()
      id: string;

      @Textarea()
      description: string;

      @Property()
      price: Price;
    }

    const form = getFormioSchema(Product);

    expect(form).toEqual({
      "machineName": "product",
      "name": "product",
      "title": "Product",
      "type": "form",
      "display": "form",
      "components": [
        {
          "key": "id",
          "label": "Id",
          "input": true,
          "type": "textfield",
          "hidden": true,
          "disabled": false,
          "validate": {
            "required": false
          }
        },
        {
          "key": "description",
          "label": "Description",
          "input": true,
          "type": "textarea",
          "autoExpand": false,
          "disabled": false,
          "validate": {
            "required": false
          }
        },
        {
          "key": "price",
          "disabled": false,
          "tableView": false,
          "type": "form",
          "display": "form",
          "input": true,
          "components": [
            {
              "key": "panel",
              "label": "Price",
              "disabled": false,
              "collapsible": false,
              "input": false,
              "tableView": false,
              "components": [
                {
                  "key": "amount",
                  "label": "Amount",
                  "currency": "USD",
                  "inputFormat": "plain",
                  "mask": false,
                  "spellcheck": true,
                  "delimiter": true,
                  "type": "number",
                  "disabled": false,
                  "input": true,
                  "requireDecimal": false,
                  "validate": {
                    "required": false
                  }
                }
              ]
            }
          ],
          "validate": {
            "required": false
          }
        }
      ]
    });
  });
});
