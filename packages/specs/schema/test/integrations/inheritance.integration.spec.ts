import {decorateMethodsOf, DecoratorParameters, decoratorTypeOf, DecoratorTypes, StoreMerge, UnsupportedDecoratorType} from "@tsed/core";

import {getSpec, In, Name, OperationPath, Path, SpecTypes} from "../../src/index.js";

function UseAuth(): Function {
  return <T>(...args: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (decoratorTypeOf(args)) {
      case DecoratorTypes.METHOD:
        return StoreMerge("test", "test")(...args);

      case DecoratorTypes.CLASS:
        decorateMethodsOf(args[0], UseAuth());
        break;

      default:
        throw new UnsupportedDecoratorType(UseAuth, args);
    }
  };
}

abstract class AttachmentController {
  @OperationPath("GET", "/:parentID/attachments")
  getAll(@In("path") @Name("parentID") parentID: string) {
    return `All attachments of ${parentID}`;
  }
}

@Path("/findings")
@UseAuth()
export class FindingsController extends AttachmentController {
  @OperationPath("GET", "/")
  get() {
    return "hello Finding";
  }
}

describe("Inheritance", () => {
  it("should return the spec (OS3)", () => {
    const spec = getSpec(FindingsController, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/findings": {
          get: {
            operationId: "findingsControllerGet",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["FindingsController"]
          }
        },
        "/findings/{parentID}/attachments": {
          get: {
            operationId: "attachmentControllerGetAll",
            parameters: [
              {
                in: "path",
                name: "parentID",
                required: true,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["FindingsController"]
          }
        }
      },
      tags: [
        {
          name: "FindingsController"
        }
      ]
    });
  });
});
