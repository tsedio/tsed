import {Property, ReadOnly, Required} from "@tsed/schema";

import {Currency, getFormioSchema, Hidden, TableView, Textarea} from "../src/index.js";

describe("Nested form integration", () => {
  it("should generate form and nested form", async () => {
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

    const form = await getFormioSchema(Product);

    expect(form).toEqual({
      machineName: "product",
      name: "product",
      title: "Product",
      type: "form",
      display: "form",
      submissionAccess: [],
      access: [],
      tags: [],
      components: [
        {
          key: "id",
          label: "Id",
          input: true,
          type: "textfield",
          hidden: true,
          disabled: false,
          validate: {
            required: false
          }
        },
        {
          key: "description",
          label: "Description",
          input: true,
          type: "textarea",
          autoExpand: false,
          disabled: false,
          validate: {
            required: false
          }
        },
        {
          key: "price",
          disabled: false,
          tableView: false,
          type: "form",
          display: "form",
          input: true,
          components: [
            {
              key: "panel",
              label: "Price",
              disabled: false,
              collapsible: false,
              input: false,
              tableView: false,
              components: [
                {
                  key: "amount",
                  label: "Amount",
                  currency: "USD",
                  inputFormat: "plain",
                  mask: false,
                  spellcheck: true,
                  delimiter: true,
                  type: "number",
                  disabled: false,
                  input: true,
                  requireDecimal: false,
                  validate: {
                    required: false
                  }
                }
              ]
            }
          ],
          validate: {
            required: false
          }
        }
      ]
    });
  });

  it("should generate form and nested form with some extra decorators", async () => {
    class Price {
      @Currency()
      amount: number;
    }

    class Product {
      @Textarea()
      description: string;

      @Required()
      @TableView(true)
      @ReadOnly()
      price: Price;
    }

    const form = await getFormioSchema(Product);

    expect(form).toEqual({
      access: [],
      components: [
        {
          autoExpand: false,
          disabled: false,
          input: true,
          key: "description",
          label: "Description",
          type: "textarea",
          validate: {
            required: false
          }
        },
        {
          key: "price",
          label: "Price",
          validate: {
            required: true
          }
        }
      ],
      display: "form",
      machineName: "product",
      name: "product",
      submissionAccess: [],
      tags: [],
      title: "Product",
      type: "form"
    });
  });
});
