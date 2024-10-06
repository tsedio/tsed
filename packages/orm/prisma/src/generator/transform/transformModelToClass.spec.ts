import {createContextFixture} from "../../__mock__/createContextFixture.js";
import {createDmmfModelFixture} from "../../__mock__/createDmmfModelFixture.js";
import {DmmfModel} from "../domain/DmmfModel.js";
import {transformModelToClass} from "./transformModelToClass.js";

describe("transformModelToClass()", () => {
  it("should transform Prisma model to a TS Model (InputType)", () => {
    const model = new DmmfModel({
      isInputType: true,
      model: {
        name: "User",
        fields: [
          {
            name: "id",
            isRequired: false,
            isNullable: false,
            type: "String",
            isList: false,
            location: ""
          }
        ]
      },
      modelType: {
        name: "user",
        fields: [
          {
            name: "id",
            isNullable: false,
            type: "String",
            isList: false,
            location: ""
          }
        ]
      }
    });

    const ctx = createContextFixture();

    expect(transformModelToClass(model, ctx)).toEqual({
      implements: ["User"],
      isExported: true,
      kind: 1,
      leadingTrivia: "\n",
      name: "UserModel",
      properties: [
        {
          decorators: [
            {
              arguments: ["String"],
              kind: 6,
              name: "Property"
            }
          ],
          kind: 30,
          name: "id",
          trailingTrivia: "\n",
          type: "string | undefined"
        }
      ],
      trailingTrivia: "\n"
    });
  });
  it("should transform Prisma model to a TS Model (InputType + required)", () => {
    const model = new DmmfModel({
      isInputType: true,
      model: {
        name: "User",
        fields: [
          {
            name: "id",
            isRequired: true,
            isNullable: false,
            type: "String",
            isList: false,
            location: ""
          }
        ]
      },
      modelType: {
        name: "user",
        fields: [
          {
            name: "id",
            isNullable: false,
            type: "String",
            isList: false,
            location: ""
          }
        ]
      }
    });

    const ctx = createContextFixture();

    expect(transformModelToClass(model, ctx)).toEqual({
      implements: ["User"],
      isExported: true,
      kind: 1,
      leadingTrivia: "\n",
      name: "UserModel",
      properties: [
        {
          decorators: [
            {
              arguments: ["String"],
              kind: 6,
              name: "Property"
            },
            {
              arguments: [],
              kind: 6,
              name: "Required"
            }
          ],
          kind: 30,
          name: "id",
          trailingTrivia: "\n",
          type: "string"
        }
      ],
      trailingTrivia: "\n"
    });
  });
  it("should transform Prisma model to a TS Model (OutputType)", () => {
    const model = new DmmfModel({
      model: {
        name: "User",
        fields: [
          {
            name: "id",
            isRequired: false,
            type: "String",
            isList: false,
            location: ""
          }
        ]
      },
      modelType: {
        name: "user",
        fields: [
          {
            name: "id",
            isNullable: true,
            type: "String",
            isList: false,
            location: ""
          }
        ]
      },
      isInputType: false
    });

    const ctx = createContextFixture();

    expect(transformModelToClass(model, ctx)).toEqual({
      implements: ["User"],
      isExported: true,
      kind: 1,
      leadingTrivia: "\n",
      name: "UserModel",
      properties: [
        {
          decorators: [
            {
              arguments: ["String"],
              kind: 6,
              name: "Property"
            },
            {
              arguments: ["null"],
              kind: 6,
              name: "Allow"
            }
          ],
          kind: 30,
          name: "id",
          trailingTrivia: "\n",
          type: "string | null"
        }
      ],
      trailingTrivia: "\n"
    });
  });
  it("should transform Prisma model to a TS Model (OutputType + required)", () => {
    const model = new DmmfModel({
      model: {
        name: "User",
        fields: [
          {
            name: "id",
            isRequired: true,
            isNullable: false,
            type: "String",
            isList: false,
            location: ""
          }
        ]
      },
      modelType: {
        name: "user",
        fields: [
          {
            name: "id",
            isNullable: false,
            type: "String",
            isList: false,
            location: ""
          }
        ]
      },
      isInputType: false
    });

    const ctx = createContextFixture();

    expect(transformModelToClass(model, ctx)).toEqual({
      implements: ["User"],
      isExported: true,
      kind: 1,
      leadingTrivia: "\n",
      name: "UserModel",
      properties: [
        {
          decorators: [
            {
              arguments: ["String"],
              kind: 6,
              name: "Property"
            },
            {
              arguments: [],
              kind: 6,
              name: "Required"
            }
          ],
          kind: 30,
          name: "id",
          trailingTrivia: "\n",
          type: "string"
        }
      ],
      trailingTrivia: "\n"
    });
  });
  it("should transform Prisma model to a TS Model (List)", () => {
    const model = new DmmfModel({
      isInputType: true,
      model: {
        name: "User",
        fields: [
          {
            name: "ids",
            isRequired: false,
            type: "String",
            isList: true,
            location: ""
          }
        ]
      },
      modelType: {
        name: "user",
        fields: [
          {
            name: "ids",
            isNullable: false,
            type: "String",
            location: ""
          }
        ]
      }
    });

    const ctx = createContextFixture();

    expect(transformModelToClass(model, ctx)).toEqual({
      implements: ["User"],
      isExported: true,
      kind: 1,
      leadingTrivia: "\n",
      name: "UserModel",
      properties: [
        {
          decorators: [
            {
              arguments: ["String"],
              kind: 6,
              name: "CollectionOf"
            }
          ],
          kind: 30,
          name: "ids",
          trailingTrivia: "\n",
          type: "string[] | undefined"
        }
      ],
      trailingTrivia: "\n"
    });
  });
  it("should transform Prisma model to a TS Model (List + required)", () => {
    const model = new DmmfModel({
      isInputType: true,
      model: {
        name: "User",
        fields: [
          {
            name: "ids",
            isRequired: true,
            type: "String",
            isList: true,
            location: ""
          }
        ]
      },
      modelType: {
        name: "user",
        fields: [
          {
            name: "ids",
            isNullable: false,
            type: "String",
            location: ""
          }
        ]
      }
    });

    const ctx = createContextFixture();

    expect(transformModelToClass(model, ctx)).toEqual({
      implements: ["User"],
      isExported: true,
      kind: 1,
      leadingTrivia: "\n",
      name: "UserModel",
      properties: [
        {
          decorators: [
            {
              arguments: ["String"],
              kind: 6,
              name: "CollectionOf"
            },
            {
              arguments: [],
              kind: 6,
              name: "Required"
            }
          ],
          kind: 30,
          name: "ids",
          trailingTrivia: "\n",
          type: "string[]"
        }
      ],
      trailingTrivia: "\n"
    });
  });
  it("should transform Prisma model to a TS Model (Enum)", () => {
    const model = new DmmfModel({
      isInputType: true,
      model: {
        name: "User",
        fields: [
          {
            name: "role",
            isRequired: true,
            type: "Role",
            isList: false,
            kind: "enum"
          }
        ]
      },
      modelType: {
        name: "user",
        fields: [
          {
            name: "role",
            isNullable: false,
            type: "Role"
          }
        ]
      }
    });

    const ctx = createContextFixture();

    expect(transformModelToClass(model, ctx)).toEqual({
      implements: ["User"],
      isExported: true,
      kind: 1,
      leadingTrivia: "\n",
      name: "UserModel",
      properties: [
        {
          decorators: [
            {
              arguments: [],
              kind: 6,
              name: "Required"
            },
            {
              arguments: ["Role"],
              kind: 6,
              name: "Enum"
            }
          ],
          kind: 30,
          name: "role",
          trailingTrivia: "\n",
          type: "Relation<Role>"
        }
      ],
      trailingTrivia: "\n"
    });
  });
  it("should transform Prisma model to a TS Model (List + Enum)", () => {
    const model = new DmmfModel({
      isInputType: true,
      model: {
        name: "User",
        fields: [
          {
            name: "role",
            isRequired: true,
            type: "Role",
            isList: true,
            kind: "enum"
          }
        ]
      },
      modelType: {
        name: "user",
        fields: [
          {
            name: "role",
            isNullable: false,
            type: "Role"
          }
        ]
      }
    });

    const ctx = createContextFixture();

    expect(transformModelToClass(model, ctx)).toEqual({
      implements: ["User"],
      isExported: true,
      kind: 1,
      leadingTrivia: "\n",
      name: "UserModel",
      properties: [
        {
          decorators: [
            {
              arguments: [],
              kind: 6,
              name: "Required"
            },
            {
              arguments: ["Role"],
              kind: 6,
              name: "Enum"
            }
          ],
          kind: 30,
          name: "role",
          trailingTrivia: "\n",
          type: "Role[]"
        }
      ],
      trailingTrivia: "\n"
    });
  });
  it("should transform Prisma model to a TS Model and exclude fields with immediate relation", () => {
    const model = createDmmfModelFixture();
    const ctx = createContextFixture();
    const output: any = transformModelToClass(model, ctx);

    expect(output.properties.map((p: any) => p.name)).toEqual([
      "id",
      "createdAt",
      "email",
      "weight",
      "is18",
      "name",
      "successorId",
      "successor",
      "predecessor",
      "role",
      "posts",
      "keywords",
      "biography"
    ]);
  });
});
