import {Email} from "@tsed/schema";
import {expect} from "chai";
import {getFormioSchema} from "../src";

describe('Email integration', () => {
  it("should generate email field", () => {
    class User {
      @Email()
      email: string;
    }
    const form = getFormioSchema(User);
    expect(form).to.deep.eq({
      components: [
        {
          disabled: false,
          input: true,
          label: "Email",
          key: "email",
          type: "email",
          validate: {
            required: false
          }
        }
      ],
      display: "form",
      machineName: "user",
      name: "user",
      title: "User",
      type: "form"
    });
  });
})
