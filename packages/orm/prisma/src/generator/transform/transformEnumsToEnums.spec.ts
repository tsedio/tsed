import {DmmfEnum} from "../domain/DmmfEnum.js";
import {transformEnumsToEnums} from "./transformEnumsToEnums.js";

describe("transformEnumsToEnums()", () => {
  it("should transform Prisma Enum to a TS Enum", () => {
    const enumModel = new DmmfEnum({
      model: {
        name: "Role",
        values: [
          {
            name: "ADMIN",
            dbName: "dbName"
          },
          {
            name: "USER",
            dbName: "dbName"
          }
        ]
      },
      modelType: {
        name: "Role",
        values: ["ADMIN", "USER"]
      }
    });

    expect(transformEnumsToEnums(enumModel)).toEqual({
      isExported: true,
      kind: 7,
      leadingTrivia: "\n",
      members: [
        {
          name: "ADMIN",
          value: "ADMIN"
        },
        {
          name: "USER",
          value: "USER"
        }
      ],
      name: "Role",
      trailingTrivia: "\n"
    });
  });
});
