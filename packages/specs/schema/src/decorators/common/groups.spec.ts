import {SpecTypes} from "../../domain/SpecTypes.js";
import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {getSpec} from "../../utils/getSpec.js";
import {CollectionOf} from "../collections/collectionOf.js";
import {In} from "../operations/in.js";
import {OperationPath} from "../operations/operationPath.js";
import {Path} from "../operations/path.js";
import {Returns} from "../operations/returns.js";
import {Groups} from "./groups.js";
import {Name} from "./name.js";
import {Property} from "./property.js";
import {Required} from "./required.js";
import {RequiredGroups} from "./requiredGroups.js";

class ChildModel {
  @Groups("!creation")
  id: string;

  @Required()
  prop1: string;
}

class MyModel {
  @Groups("!creation")
  id: string;

  @Groups("group.summary")
  @Required()
  prop1: string;

  @Groups("group.extended")
  @Required()
  prop2: string;

  @Property()
  @Required()
  prop3: string;

  @CollectionOf(ChildModel)
  prop4: ChildModel[];
}

describe("@Groups", () => {
  describe("JsonSchema", () => {
    it("should show fields with group annotation", () => {
      const spec = getJsonSchema(MyModel, {
        groups: false
      });

      expect(spec).toEqual({
        definitions: {
          ChildModel: {
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["prop1"],
            type: "object"
          }
        },
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            minLength: 1,
            type: "string"
          },
          prop2: {
            minLength: 1,
            type: "string"
          },
          prop3: {
            minLength: 1,
            type: "string"
          },
          prop4: {
            items: {
              $ref: "#/definitions/ChildModel"
            },
            type: "array"
          }
        },
        required: ["prop1", "prop2", "prop3"],
        type: "object"
      });
    });
    it("should show fields with group annotation (with x-groups custom key)", () => {
      const spec = getJsonSchema(MyModel, {
        groups: false,
        customKeys: true
      });

      expect(spec).toEqual({
        definitions: {
          ChildModel: {
            properties: {
              id: {
                "x-groups": ["!creation"],
                type: "string"
              },
              prop1: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["prop1"],
            type: "object"
          }
        },
        properties: {
          id: {
            "x-groups": ["!creation"],
            type: "string"
          },
          prop1: {
            "x-groups": ["group.summary"],
            minLength: 1,
            type: "string"
          },
          prop2: {
            "x-groups": ["group.extended"],
            minLength: 1,
            type: "string"
          },
          prop3: {
            minLength: 1,
            type: "string"
          },
          prop4: {
            items: {
              $ref: "#/definitions/ChildModel"
            },
            type: "array"
          }
        },
        required: ["prop1", "prop2", "prop3"],
        type: "object"
      });
    });
    it("should show fields with group annotation if the an empty array is given to group fields", () => {
      const spec = getJsonSchema(MyModel, {
        groups: []
      });

      expect(spec).toEqual({
        definitions: {
          ChildModel: {
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["prop1"],
            type: "object"
          }
        },
        properties: {
          id: {
            type: "string"
          },
          prop3: {
            minLength: 1,
            type: "string"
          },
          prop4: {
            items: {
              $ref: "#/definitions/ChildModel"
            },
            type: "array"
          }
        },
        required: ["prop3"],
        type: "object"
      });
    });
    it("should show fields with group annotation if the an empty any groups is given", () => {
      const spec = getJsonSchema(MyModel);

      expect(spec).toEqual({
        definitions: {
          ChildModel: {
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["prop1"],
            type: "object"
          }
        },
        properties: {
          id: {
            type: "string"
          },
          prop3: {
            minLength: 1,
            type: "string"
          },
          prop4: {
            items: {
              $ref: "#/definitions/ChildModel"
            },
            type: "array"
          }
        },
        required: ["prop3"],
        type: "object"
      });
    });
    it("should display fields when a group match with (group.summary)", () => {
      const spec = getJsonSchema(MyModel, {
        groups: ["group.summary"]
      });

      expect(spec).toEqual({
        definitions: {
          ChildModel: {
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["prop1"],
            type: "object"
          }
        },
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            minLength: 1,
            type: "string"
          },
          prop3: {
            minLength: 1,
            type: "string"
          },
          prop4: {
            items: {
              $ref: "#/definitions/ChildModel"
            },
            type: "array"
          }
        },
        required: ["prop1", "prop3"],
        type: "object"
      });
    });
    it("should display fields when a group match with (creation)", () => {
      const spec = getJsonSchema(MyModel, {
        groups: ["creation"]
      });

      expect(spec).toEqual({
        definitions: {
          ChildModel: {
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["prop1"],
            type: "object"
          }
        },
        properties: {
          prop3: {
            minLength: 1,
            type: "string"
          },
          prop4: {
            items: {
              $ref: "#/definitions/ChildModel"
            },
            type: "array"
          }
        },
        required: ["prop3"],
        type: "object"
      });
    });
    it("should display fields when a group match with (pattern)", () => {
      const spec = getJsonSchema(MyModel, {
        groups: ["group.*"]
      });

      expect(spec).toEqual({
        definitions: {
          ChildModel: {
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["prop1"],
            type: "object"
          }
        },
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            minLength: 1,
            type: "string"
          },
          prop2: {
            minLength: 1,
            type: "string"
          },
          prop3: {
            minLength: 1,
            type: "string"
          },
          prop4: {
            items: {
              $ref: "#/definitions/ChildModel"
            },
            type: "array"
          }
        },
        required: ["prop1", "prop2", "prop3"],
        type: "object"
      });
    });
    it("should show fields with group annotation (by class)", () => {
      @Groups<User>({
        // will generate UserCreate
        creation: ["firstName", "lastName", "email", "password"],
        // will generate UserUpdate
        update: ["id", "firstName", "lastName", "email"],
        // will generate UserChangePassword
        changePassword: ["id", "password", "newPassword"]
      })
      class User {
        @Required()
        id: string;

        @Required()
        @RequiredGroups("creation")
        firstName: string;

        @Required()
        @RequiredGroups("creation")
        lastName: string;

        @Required()
        @RequiredGroups("creation")
        email: string;

        @Required()
        @RequiredGroups("create", "changePassword")
        password: string;

        @Required()
        @RequiredGroups("changePassword")
        newPassword: string;
      }

      const spec1 = getJsonSchema(User, {
        groups: ["creation"]
      });

      expect(spec1).toEqual({
        properties: {
          email: {
            minLength: 1,
            type: "string"
          },
          firstName: {
            minLength: 1,
            type: "string"
          },
          lastName: {
            minLength: 1,
            type: "string"
          },
          password: {
            minLength: 1,
            type: "string"
          }
        },
        required: ["firstName", "lastName", "email"],
        type: "object"
      });

      const spec2 = getJsonSchema(User, {
        groups: ["update"]
      });

      expect(spec2).toEqual({
        properties: {
          email: {
            minLength: 1,
            type: "string"
          },
          firstName: {
            minLength: 1,
            type: "string"
          },
          id: {
            minLength: 1,
            type: "string"
          },
          lastName: {
            minLength: 1,
            type: "string"
          }
        },
        required: ["id"],
        type: "object"
      });

      const spec3 = getJsonSchema(User, {
        groups: ["changePassword"]
      });

      expect(spec3).toEqual({
        properties: {
          id: {
            minLength: 1,
            type: "string"
          },
          newPassword: {
            minLength: 1,
            type: "string"
          },
          password: {
            minLength: 1,
            type: "string"
          }
        },
        required: ["id", "password", "newPassword"],
        type: "object"
      });
    });
  });
  describe("OpenSpec", () => {
    it("should display fields when a group match with - body (OS3)", () => {
      @Path("/")
      class MyController {
        @OperationPath("POST", "/")
        @(Returns(201, MyModel).Groups("group.*"))
        create(@In("body") @Groups("creation") payload: MyModel) {
          return new MyModel();
        }

        @OperationPath("PUT", "/:id")
        @Returns(200, MyModel)
        update(@In("body") @Groups("group.*") payload: MyModel, @In("path") @Name("id") id: string) {
          return new MyModel();
        }
      }

      const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

      expect(spec).toEqual({
        components: {
          schemas: {
            ChildModel: {
              properties: {
                id: {
                  type: "string"
                },
                prop1: {
                  minLength: 1,
                  type: "string"
                }
              },
              required: ["prop1"],
              type: "object"
            },
            MyModel: {
              properties: {
                id: {
                  type: "string"
                },
                prop3: {
                  minLength: 1,
                  type: "string"
                },
                prop4: {
                  items: {
                    $ref: "#/components/schemas/ChildModel"
                  },
                  type: "array"
                }
              },
              required: ["prop3"],
              type: "object"
            },
            MyModelCreation: {
              properties: {
                prop3: {
                  minLength: 1,
                  type: "string"
                },
                prop4: {
                  items: {
                    $ref: "#/components/schemas/ChildModel"
                  },
                  type: "array"
                }
              },
              required: ["prop3"],
              type: "object"
            },
            MyModelGroup: {
              properties: {
                id: {
                  type: "string"
                },
                prop1: {
                  minLength: 1,
                  type: "string"
                },
                prop2: {
                  minLength: 1,
                  type: "string"
                },
                prop3: {
                  minLength: 1,
                  type: "string"
                },
                prop4: {
                  items: {
                    $ref: "#/components/schemas/ChildModel"
                  },
                  type: "array"
                }
              },
              required: ["prop1", "prop2", "prop3"],
              type: "object"
            }
          }
        },
        paths: {
          "/": {
            post: {
              operationId: "myControllerCreate",
              parameters: [],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/MyModelCreation"
                    }
                  }
                },
                required: false
              },
              responses: {
                "201": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModelGroup"
                      }
                    }
                  },
                  description: "Created"
                }
              },
              tags: ["MyController"]
            }
          },
          "/{id}": {
            put: {
              operationId: "myControllerUpdate",
              parameters: [
                {
                  in: "path",
                  name: "id",
                  required: true,
                  schema: {
                    type: "string"
                  }
                }
              ],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/MyModelGroup"
                    }
                  }
                },
                required: false
              },
              responses: {
                "200": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModel"
                      }
                    }
                  },
                  description: "Success"
                }
              },
              tags: ["MyController"]
            }
          }
        },
        tags: [
          {
            name: "MyController"
          }
        ]
      });
    });
    it("should display fields when a group match with - body and a group name (OS3)", () => {
      @Path("/")
      class MyController {
        @OperationPath("POST", "/")
        @(Returns(201, MyModel).Groups("group.*"))
        create(@In("body") @Groups("CreatePayload", ["creation"]) payload: MyModel) {
          return new MyModel();
        }

        @OperationPath("PUT", "/:id")
        @Returns(200, MyModel)
        update(@In("body") @Groups("Complete", "group.*") payload: MyModel, @In("path") @Name("id") id: string) {
          return new MyModel();
        }
      }

      const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

      expect(spec).toMatchSnapshot();
    });
    it("should display fields when a group match with - query (OS3)", () => {
      @Path("/")
      class MyController {
        @OperationPath("GET", "/")
        @(Returns(201, MyModel).Groups("group.*"))
        get(@In("query") @Groups("creation") payload: MyModel) {
          return new MyModel();
        }

        @OperationPath("GET", "/all")
        @(Returns(201, MyModel).Groups("group.*"))
        getWithout(@In("query") payload: MyModel) {
          return new MyModel();
        }
      }

      const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

      expect(spec).toEqual({
        components: {
          schemas: {
            ChildModel: {
              properties: {
                id: {
                  type: "string"
                },
                prop1: {
                  minLength: 1,
                  type: "string"
                }
              },
              required: ["prop1"],
              type: "object"
            },
            MyModelCreation: {
              properties: {
                prop3: {
                  minLength: 1,
                  type: "string"
                },
                prop4: {
                  items: {
                    $ref: "#/components/schemas/ChildModel"
                  },
                  type: "array"
                }
              },
              required: ["prop3"],
              type: "object"
            },
            MyModelGroup: {
              properties: {
                id: {
                  type: "string"
                },
                prop1: {
                  minLength: 1,
                  type: "string"
                },
                prop2: {
                  minLength: 1,
                  type: "string"
                },
                prop3: {
                  minLength: 1,
                  type: "string"
                },
                prop4: {
                  items: {
                    $ref: "#/components/schemas/ChildModel"
                  },
                  type: "array"
                }
              },
              required: ["prop1", "prop2", "prop3"],
              type: "object"
            }
          }
        },
        paths: {
          "/": {
            get: {
              operationId: "myControllerGet",
              parameters: [
                {
                  in: "query",
                  name: "prop3",
                  required: true,
                  schema: {
                    minLength: 1,
                    type: "string"
                  }
                },
                {
                  in: "query",
                  name: "prop4",
                  required: false,
                  schema: {
                    items: {
                      $ref: "#/components/schemas/ChildModel"
                    },
                    type: "array"
                  }
                }
              ],
              responses: {
                "201": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModelGroup"
                      }
                    }
                  },
                  description: "Created"
                }
              },
              tags: ["MyController"]
            }
          },
          "/all": {
            get: {
              operationId: "myControllerGetWithout",
              parameters: [
                {
                  in: "query",
                  name: "id",
                  required: false,
                  schema: {
                    type: "string"
                  }
                },
                {
                  in: "query",
                  name: "prop3",
                  required: true,
                  schema: {
                    minLength: 1,
                    type: "string"
                  }
                },
                {
                  in: "query",
                  name: "prop4",
                  required: false,
                  schema: {
                    items: {
                      $ref: "#/components/schemas/ChildModel"
                    },
                    type: "array"
                  }
                }
              ],
              responses: {
                "201": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModelGroup"
                      }
                    }
                  },
                  description: "Created"
                }
              },
              tags: ["MyController"]
            }
          }
        },
        tags: [
          {
            name: "MyController"
          }
        ]
      });
    });
    it("should display fields when a group match with (array - OS3)", () => {
      @Path("/")
      class MyController {
        @OperationPath("POST", "/")
        @(Returns(201, Array).Of(MyModel).Groups("group.*"))
        createWithArray(@In("body") @Groups("creation") @CollectionOf(MyModel) payload: MyModel[]) {
          return [new MyModel()];
        }
      }

      const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

      expect(spec).toEqual({
        components: {
          schemas: {
            ChildModel: {
              properties: {
                id: {
                  type: "string"
                },
                prop1: {
                  minLength: 1,
                  type: "string"
                }
              },
              required: ["prop1"],
              type: "object"
            },
            MyModelCreation: {
              properties: {
                prop3: {
                  minLength: 1,
                  type: "string"
                },
                prop4: {
                  items: {
                    $ref: "#/components/schemas/ChildModel"
                  },
                  type: "array"
                }
              },
              required: ["prop3"],
              type: "object"
            },
            MyModelGroup: {
              properties: {
                id: {
                  type: "string"
                },
                prop1: {
                  minLength: 1,
                  type: "string"
                },
                prop2: {
                  minLength: 1,
                  type: "string"
                },
                prop3: {
                  minLength: 1,
                  type: "string"
                },
                prop4: {
                  items: {
                    $ref: "#/components/schemas/ChildModel"
                  },
                  type: "array"
                }
              },
              required: ["prop1", "prop2", "prop3"],
              type: "object"
            }
          }
        },
        paths: {
          "/": {
            post: {
              operationId: "myControllerCreateWithArray",
              parameters: [],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      items: {
                        $ref: "#/components/schemas/MyModelCreation"
                      },
                      type: "array"
                    }
                  }
                },
                required: false
              },
              responses: {
                "201": {
                  content: {
                    "application/json": {
                      schema: {
                        items: {
                          $ref: "#/components/schemas/MyModelGroup"
                        },
                        type: "array"
                      }
                    }
                  },
                  description: "Created"
                }
              },
              tags: ["MyController"]
            }
          }
        },
        tags: [
          {
            name: "MyController"
          }
        ]
      });
    });
    it("should display fields when a group match with (array & groups - OS3)", () => {
      @Path("/")
      class MyController {
        @OperationPath("POST", "/")
        @(Returns(201, Array).Of(MyModel).Groups("Details", ["group.*"]))
        createWithArray(@In("body") @Groups("Create", ["creation"]) @CollectionOf(MyModel) payload: MyModel[]) {
          return [new MyModel()];
        }
      }

      const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

      expect(spec).toMatchSnapshot();
    });
  });
});
