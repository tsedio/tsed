import {Name, Nullable, Required} from "@tsed/schema";

import {serialize} from "../../src/utils/serialize.js";

export class ExtensionModel {
  @Required()
  id: string;

  @Required()
  @Name("extNumber")
  extensionNumber: string;
}

export class UserModel {
  @Required()
  id: string;

  @Nullable(ExtensionModel)
  extension?: ExtensionModel | null;
}

describe("Nullable integration", () => {
  it("should serialize the model", () => {
    const user = new UserModel();
    user.id = "1";
    user.extension = new ExtensionModel();
    user.extension.id = "2";
    user.extension.extensionNumber = "122";

    // @ts-ignore
    user.extension.name = "ext";

    const obj = serialize(user, {type: UserModel});
    expect(obj).toEqual({
      extension: {
        extNumber: "122",
        id: "2"
      },
      id: "1"
    });
  });

  it("should serialize the model with plain object", () => {
    const obj = serialize(
      {
        id: "1",
        extension: {
          id: "2",
          name: "ext",
          extensionNumber: "123"
        }
      },
      {type: UserModel}
    );

    expect(obj).toEqual({
      extension: {
        extNumber: "123",
        id: "2"
      },
      id: "1"
    });
  });
});
