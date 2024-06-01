import {TransformContext} from "../generator/domain/TransformContext.js";

export function createContextFixture(): TransformContext {
  return {
    modelsMap: new Map()
      .set("User", {
        name: "User",
        fields: [{type: "Role"}]
      })
      .set("Role", {
        name: "Role",
        fields: [{type: "User"}, {type: "Transitive"}]
      })
      .set("Transitive", {
        name: "Transitive",
        fields: [{type: "String"}, {type: "User"}]
      })
      .set("Hello", {
        name: "Hello",
        fields: [{type: "String"}, {type: "User"}]
      })
  } as any;
}
