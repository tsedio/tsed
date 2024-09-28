import {Email} from "@tsed/schema";

import {getFormioSchema} from "../src/index.js";

describe("Email integration", () => {
  it("should generate email field", async () => {
    class User {
      @Email()
      email: string;
    }
    const form = await getFormioSchema(User);
    expect(form).toEqual({
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
      type: "form",
      submissionAccess: [],
      access: [],
      tags: []
    });
  });
});
