import Ajv from "ajv";
import {expect} from "chai";
import {JsonSchema} from "./JsonSchema";

describe("JsonSchema", () => {
  describe("extra Props", () => {
    // https://json-schema.org/understanding-json-schema/basics.html
    it("should add extra props", () => {
      const schema = JsonSchema.from({});
      schema.set("extra", "test");

      expect(schema.isGeneric).to.equal(false);
      expect(schema.genericType).to.equal(undefined);
      expect(schema.toJSON()).to.deep.equal({
        extra: "test"
      });
    });
  });
  describe("basics", () => {
    // https://json-schema.org/understanding-json-schema/basics.html
    it("should validate {}", () => {
      const schema = JsonSchema.from({}).toObject();
      const validate = new Ajv().compile(schema);

      expect(schema).to.deep.equal({});
      expect(validate(42)).to.equal(true);
      expect(validate("I'm a string")).to.equal(true);
      expect(validate({an: ["arbitrarily", "nested"], data: "structure"})).to.equal(true);
    });
  });
  describe("String", () => {
    describe("Basics", () => {
      // https://json-schema.org/understanding-json-schema/reference/string.html#string
      it("should create a new jsonSchema", () => {
        const schema = JsonSchema.from({type: String}).toObject();
        const validate = new Ajv().compile(schema);

        expect(schema).to.deep.equal({
          type: "string"
        });

        expect(validate("This is a string")).to.equal(true);
        expect(validate("Déjà vu")).to.equal(true);
        expect(validate("")).to.equal(true);
        expect(validate("42")).to.equal(true);
        expect(validate(42)).to.equal(false);
      });
    });

    describe("Length", () => {
      // https://json-schema.org/understanding-json-schema/reference/string.html#length
      it("should create a new jsonSchema", () => {
        const schema = JsonSchema.from({type: String}).minLength(2).maxLength(3).toObject();

        const validate = new Ajv().compile(schema);

        expect(schema).to.deep.equal({
          type: "string",
          minLength: 2,
          maxLength: 3
        });

        expect(validate("A")).to.equal(false);
        expect(validate("AB")).to.equal(true);
        expect(validate("ABC")).to.equal(true);
        expect(validate("ABCD")).to.equal(false);
      });
    });

    describe("Regular expression", () => {
      // https://json-schema.org/understanding-json-schema/reference/string.html#regular-expressions
      it("should build json schema", () => {
        const schema = JsonSchema.from({type: String}).pattern(new RegExp("^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$")).toObject();

        const validate = new Ajv().compile(schema);

        expect(schema).to.deep.equal({
          type: "string",
          pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
        });

        expect(validate("555-1212")).to.equal(true);
        expect(validate("(888)555-1212")).to.equal(true);
        expect(validate("(888)555-1212 ext. 532")).to.equal(false);
        expect(validate("(800)FLOWERS")).to.equal(false);
      });
    });

    describe("Format", () => {
      // https://json-schema.org/understanding-json-schema/reference/string.html#format
      it("should create a new jsonSchema", () => {
        const result = JsonSchema.from({type: Date}).toObject();

        expect(result).to.deep.equal({
          type: "string"
        });
      });

      it("should create a new jsonSchema with format", () => {
        const result = JsonSchema.from({type: Date}).format("date-time").toObject();

        expect(result).to.deep.equal({
          type: "string",
          format: "date-time"
        });
      });
    });
  });
  describe("Number", () => {
    describe("Basics", () => {
      // https://json-schema.org/understanding-json-schema/reference/numeric.html#number
      it("should create a jsonschema for number", () => {
        const schema = JsonSchema.from({type: Number}).toObject();
        const validate = new Ajv().compile(schema);

        expect(schema).to.deep.equal({
          type: "number"
        });
        expect(validate(42)).to.equal(true);
        expect(validate(-1)).to.equal(true);
        expect(validate(5.0)).to.equal(true);
        expect(validate(2.99792458e8)).to.equal(true);
        expect(validate("42")).to.equal(false);
      });
    });

    describe("Integer", () => {
      // https://json-schema.org/understanding-json-schema/reference/numeric.html#integer
      it("should create a jsonschema", () => {
        const schema = JsonSchema.from({type: "integer"}).toObject();
        const validate = new Ajv().compile(schema);

        expect(schema).to.deep.equal({
          type: "integer",
          multipleOf: 1.0
        });
        expect(validate(42)).to.equal(true);
        expect(validate(42.0)).to.equal(true);
        expect(validate(3.14156926)).to.equal(false);
      });
    });

    describe("Multiples", () => {
      // https://json-schema.org/understanding-json-schema/reference/numeric.html#multiples
      it("should create a jsonschema", () => {
        const schema = JsonSchema.from({type: Number, multipleOf: 10}).toObject();
        const validate = new Ajv().compile(schema);

        expect(schema).to.deep.equal({
          type: "number",
          multipleOf: 10
        });
        expect(validate(0)).to.equal(true);
        expect(validate(10)).to.equal(true);
        expect(validate(20)).to.equal(true);
        expect(validate(23)).to.equal(false);
      });
    });

    describe("Ranges", () => {
      // https://json-schema.org/understanding-json-schema/reference/numeric.html#range
      it("should create a jsonschema minimum & exclusiveMaximum", () => {
        const schema = JsonSchema.from({type: Number, minimum: 0, exclusiveMaximum: 100}).toObject();
        const validate = new Ajv().compile(schema);

        expect(schema).to.deep.equal({
          type: "number",
          minimum: 0,
          exclusiveMaximum: 100
        });
        expect(validate(0)).to.equal(true);
        expect(validate(10)).to.equal(true);
        expect(validate(99)).to.equal(true);
        expect(validate(100)).to.equal(false);
        expect(validate(101)).to.equal(false);
      });
      it("should create a jsonschema exclusiveMinimum & maximum", () => {
        const schema = JsonSchema.from({type: Number, exclusiveMinimum: 0, maximum: 100}).toObject();
        const validate = new Ajv().compile(schema);

        expect(schema).to.deep.equal({
          type: "number",
          exclusiveMinimum: 0,
          maximum: 100
        });
        expect(validate(-1)).to.equal(false);
        expect(validate(0)).to.equal(false);
        expect(validate(1)).to.equal(true);
        expect(validate(10)).to.equal(true);
        expect(validate(99)).to.equal(true);
        expect(validate(100)).to.equal(true);
        expect(validate(101)).to.equal(false);
      });
    });
  });
  describe("Object", () => {
    describe("basic", () => {
      // https://json-schema.org/understanding-json-schema/reference/object.html#object
      it("should create a new jsonSchema", () => {
        const schema = JsonSchema.from({type: Object}).toObject();
        const validate = new Ajv().compile(schema);

        expect(schema).to.deep.equal({
          type: "object"
        });

        expect(
          validate({
            key: "value",
            another_key: "another_value"
          })
        ).to.equal(true);
        expect(
          validate({
            Sun: 1.9891e30,
            Jupiter: 1.8986e27,
            Saturn: 5.6846e26,
            Neptune: 10.243e25,
            Uranus: 8.681e25,
            Earth: 5.9736e24,
            Venus: 4.8685e24,
            Mars: 6.4185e23,
            Mercury: 3.3022e23,
            Moon: 7.349e22,
            Pluto: 1.25e22
          })
        ).to.equal(true);
        expect(
          validate({
            0.01: "cm",
            1: "m",
            1000: "km"
          })
        ).to.equal(true);
        expect(validate("Not an object")).to.equal(false);
        expect(validate(["An", "array", "not", "an", "object"])).to.equal(false);
      });
    });
    describe("Properties", () => {
      // https://json-schema.org/understanding-json-schema/reference/object.html#properties
      it("should create a valid jsonchema (properties)", () => {
        const schema = JsonSchema.from({
          type: Object,
          properties: {
            number: {type: "number"},
            street_name: {type: "string"},
            street_type: {
              type: "string",
              enum: ["Street", "Avenue", "Boulevard"]
            }
          }
        }).toObject();

        const validate = new Ajv().compile(schema);
        expect(validate({number: 1600, street_name: "Pennsylvania", street_type: "Avenue"})).to.equal(true);
        expect(validate({number: "1600", street_name: "Pennsylvania", street_type: "Avenue"})).to.equal(false);
        expect(validate({number: 1600, street_name: "Pennsylvania"})).to.equal(true);
        expect(validate({})).to.equal(true);
        expect(
          validate({
            number: 1600,
            street_name: "Pennsylvania",
            street_type: "Avenue",
            direction: "NW"
          })
        ).to.equal(true);
      });
      it("should create a valid jsonschema (additionalProperties boolean)", () => {
        const schema = JsonSchema.from({
          type: "object",
          properties: {
            number: {type: "number"},
            street_name: {type: "string"},
            street_type: {
              type: "string",
              enum: ["Street", "Avenue", "Boulevard"]
            }
          },
          additionalProperties: false // Unauthorized unknown properties
        }).toObject();

        expect(schema).to.deep.eq({
          type: "object",
          properties: {
            number: {type: "number"},
            street_name: {type: "string"},
            street_type: {
              type: "string",
              enum: ["Street", "Avenue", "Boulevard"]
            }
          },
          additionalProperties: false // Unauthorized unknown properties
        });

        const validate = new Ajv().compile(schema);

        expect(validate({number: 1600, street_name: "Pennsylvania", street_type: "Avenue"})).to.equal(true);
        expect(
          validate({
            number: 1600,
            street_name: "Pennsylvania",
            street_type: "Avenue",
            direction: "NW"
          })
        ).to.equal(false);
      });
      it("should create a valid jsonchema (additionalProperties schema)", () => {
        const schema = JsonSchema.from({
          type: "object",
          properties: {
            number: {type: "number"},
            street_name: {type: "string"},
            street_type: {
              type: "string",
              enum: ["Street", "Avenue", "Boulevard"]
            }
          },
          additionalProperties: JsonSchema.from({type: "string"})
        }).toObject();

        const validate = new Ajv().compile(schema);

        expect(validate({number: 1600, street_name: "Pennsylvania", street_type: "Avenue"})).to.equal(true);
        expect(
          validate({
            number: 1600,
            street_name: "Pennsylvania",
            street_type: "Avenue",
            direction: "NW"
          })
        ).to.equal(true);
        expect(
          validate({
            number: 1600,
            street_name: "Pennsylvania",
            street_type: "Avenue",
            office_number: 201
          })
        ).to.equal(false);
      });
    });
    describe("Required", () => {
      // https://json-schema.org/understanding-json-schema/reference/object.html#required-properties
      it("should create a valid jsonchema (basic)", () => {
        const jsonSchema = JsonSchema.from({
          type: "object",
          properties: {
            name: {type: "string"},
            email: {type: "string"},
            address: {type: "string"},
            telephone: {type: "string"}
          },
          required: ["name", "email", "email"]
        });

        const schema = jsonSchema.clone().toObject();

        expect(jsonSchema.isRequired("name")).to.equal(true);
        expect(schema).to.deep.equal({
          type: "object",
          properties: {
            name: {type: "string", minLength: 1},
            email: {type: "string", minLength: 1},
            address: {type: "string"},
            telephone: {type: "string"}
          },
          required: ["name", "email"]
        });

        const validate = new Ajv().compile(schema);
        expect(
          validate({
            name: "William Shakespeare",
            email: "bill@stratford-upon-avon.co.uk"
          })
        ).to.equal(true);
        expect(
          validate({
            name: "William Shakespeare",
            email: "bill@stratford-upon-avon.co.uk",
            address: "Henley Street, Stratford-upon-Avon, Warwickshire, England",
            authorship: "in question"
          })
        ).to.equal(true);
        expect(
          validate({
            name: "William Shakespeare",
            address: "Henley Street, Stratford-upon-Avon, Warwickshire, England"
          })
        ).to.equal(false);
      });
      it("should create a valid jsonchema (default - string)", () => {
        const schema = JsonSchema.from({
          type: "object",
          properties: {
            name: {type: "string"}
          },
          required: ["name"]
        }).toObject();

        expect(schema).to.deep.equal({
          type: "object",
          properties: {
            name: {type: "string", minLength: 1}
          },
          required: ["name"]
        });

        const validate = new Ajv().compile(schema);
        expect(validate({name: "William Shakespeare"})).to.equal(true);
        expect(validate({name: ""})).to.equal(false);
        expect(validate({name: null})).to.equal(false);
        expect(validate({name: 0})).to.equal(false);
        expect(validate({})).to.equal(false);
      });

      it("should create a valid jsonchema (default - number)", () => {
        const schema = JsonSchema.from({
          type: "object",
          properties: {
            name: {type: "number"}
          },
          required: ["name"]
        }).toObject();

        expect(schema).to.deep.equal({
          type: "object",
          properties: {
            name: {type: "number"}
          },
          required: ["name"]
        });

        const validate = new Ajv().compile(schema);
        expect(validate({name: "William Shakespeare"})).to.equal(false);
        expect(validate({name: ""})).to.equal(false);
        expect(validate({name: null})).to.equal(false);
        expect(validate({name: 0})).to.equal(true);
        expect(validate({})).to.equal(false);
      });

      it("should create a valid jsonchema (empty string is falsy)", () => {
        const schema = JsonSchema.from({
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 1
            }
          },
          required: ["name"]
        }).toObject();

        expect(schema).to.deep.equal({
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 1
            }
          },
          required: ["name"]
        });

        const validate = new Ajv().compile(schema);
        expect(validate({name: "William Shakespeare"})).to.equal(true);
        expect(validate({name: ""})).to.equal(false);
        expect(validate({name: null})).to.equal(false);
        expect(validate({name: 0})).to.equal(false);
        expect(validate({})).to.equal(false);
      });

      it("should create a valid jsonchema (0 is falsy - number)", () => {
        const schema = JsonSchema.from({
          type: "object",
          properties: {
            name: {type: "number", exclusiveMinimum: 0}
          },
          required: ["name"]
        }).toObject();

        expect(schema).to.deep.equal({
          type: "object",
          properties: {
            name: {type: "number", exclusiveMinimum: 0}
          },
          required: ["name"]
        });

        const validate = new Ajv().compile(schema);
        expect(validate({name: "William Shakespeare"})).to.equal(false);
        expect(validate({name: ""})).to.equal(false);
        expect(validate({name: null})).to.equal(false);
        expect(validate({name: 0})).to.equal(false);
        expect(validate({})).to.equal(false);
      });
    });
    describe("Property names", () => {
      // https://json-schema.org/understanding-json-schema/reference/object.html#property-names
      it("should create a valid jsonchema", () => {
        const schema = JsonSchema.from({
          type: "object",
          propertyNames: JsonSchema.from({
            pattern: "^[A-Za-z_][A-Za-z0-9_]*$"
          })
        }).toObject();

        const validate = new Ajv().compile(schema);
        expect(
          validate({
            _a_proper_token_001: "value"
          })
        ).to.equal(true);
        expect(
          validate({
            "001 invalid": "value"
          })
        ).to.equal(false);
      });
    });
    describe("Size", () => {
      // https://json-schema.org/understanding-json-schema/reference/object.html#size
      it("should create a valid jsonchema", () => {
        const schema = JsonSchema.from({
          type: "object",
          minProperties: 2,
          maxProperties: 3
        }).toObject();

        const validate = new Ajv().compile(schema);
        expect(validate({})).to.equal(false);
        expect(validate({a: 0})).to.equal(false);
        expect(validate({a: 0, b: 1})).to.equal(true);
        expect(validate({a: 0, b: 1, c: 2})).to.equal(true);
        expect(validate({a: 0, b: 1, c: 2, d: 3})).to.equal(false);
      });
    });
    describe("Dependencies", () => {
      // https://json-schema.org/understanding-json-schema/reference/object.html#dependencies
      describe("Property Dependencies", () => {
        it("should create a valid jsonchema", () => {
          const schema = JsonSchema.from({
            type: "object",

            properties: {
              name: {type: "string"},
              credit_card: {type: "number"},
              billing_address: {type: "string"}
            },

            required: ["name"],

            dependencies: {
              credit_card: ["billing_address"]
            }
          }).toObject();

          expect(schema).to.deep.eq({
            type: "object",

            properties: {
              name: {type: "string", minLength: 1},
              credit_card: {type: "number"},
              billing_address: {type: "string"}
            },

            required: ["name"],

            dependencies: {
              credit_card: ["billing_address"]
            }
          });

          const validate = new Ajv().compile(schema);
          expect(
            validate({
              name: "John Doe",
              credit_card: 5555555555555555,
              billing_address: "555 Debtor's Lane"
            })
          ).to.equal(true);
          expect(
            validate({
              name: "John Doe",
              credit_card: 5555555555555555
            })
          ).to.equal(false);
          expect(
            validate({
              name: "John Doe"
            })
          ).to.equal(true);
          expect(
            validate({
              name: "John Doe",
              billing_address: "555 Debtor's Lane"
            })
          ).to.equal(true);
        });
        it("should create a valid jsonchema (bidirectional dependencies)", () => {
          const schema = JsonSchema.from({
            type: "object",

            properties: {
              name: {type: "string"},
              credit_card: {type: "number"},
              billing_address: {type: "string"}
            },

            required: ["name"],

            dependencies: {
              credit_card: ["billing_address"],
              billing_address: ["credit_card"]
            }
          }).toObject();

          const validate = new Ajv().compile(schema);
          expect(
            validate({
              name: "John Doe",
              credit_card: 5555555555555555
            })
          ).to.equal(false);
          expect(
            validate({
              name: "John Doe",
              billing_address: "555 Debtor's Lane"
            })
          ).to.equal(false);
        });
      });
      describe("Schema Dependencies", () => {
        it("should create a valid jsonchema", () => {
          const schema = JsonSchema.from({
            type: "object",

            properties: {
              name: {type: "string"},
              credit_card: {type: "number"}
            },

            required: ["name"],

            dependencies: {
              credit_card: {
                properties: {
                  billing_address: {type: "string"}
                },
                required: ["billing_address"]
              }
            }
          }).toObject();

          const validate = new Ajv().compile(schema);
          expect(
            validate({
              name: "John Doe",
              credit_card: 5555555555555555,
              billing_address: "555 Debtor's Lane"
            })
          ).to.equal(true);
          expect(
            validate({
              name: "John Doe",
              credit_card: 5555555555555555
            })
          ).to.equal(false);
          expect(
            validate({
              name: "John Doe"
            })
          ).to.equal(true);
          expect(
            validate({
              name: "John Doe",
              billing_address: "555 Debtor's Lane"
            })
          ).to.equal(true);
        });
      });
    });
    describe("Pattern Properties", () => {
      // https://json-schema.org/understanding-json-schema/reference/object.html#pattern-properties
      it("should create a valid jsonchema with false value", () => {
        const schema = JsonSchema.from({
          type: "object",
          patternProperties: {
            "^S_": {type: "string"},
            "^I_": {type: "integer"}
          },
          additionalProperties: false
        }).toObject();

        expect(schema).to.deep.equal({
          type: "object",
          patternProperties: {
            "^S_": {type: "string"},
            "^I_": {
              type: "integer",
              multipleOf: 1
            }
          },
          additionalProperties: false
        });

        const validate = new Ajv().compile(schema);
        expect(validate({S_25: "This is a string"})).to.equal(true);
        expect(validate({I_0: 42})).to.equal(true);
        expect(validate({S_0: 42})).to.equal(false);
        expect(validate({I_42: "This is a string"})).to.equal(false);
        expect(validate({keyword: "value"})).to.equal(false);
      });
      it("should create a valid jsonchema with schema value", () => {
        const schema = JsonSchema.from({
          type: "object",
          properties: {
            builtin: {type: "number"}
          },
          patternProperties: {
            "^S_": {type: "string"},
            "^I_": {type: "integer"}
          },
          additionalProperties: JsonSchema.from({type: "string"})
        }).toObject();

        expect(schema).to.deep.equal({
          type: "object",
          properties: {
            builtin: {type: "number"}
          },
          patternProperties: {
            "^S_": {type: "string"},
            "^I_": {type: "integer", multipleOf: 1.0}
          },
          additionalProperties: {type: "string"}
        });

        const validate = new Ajv().compile(schema);
        expect(validate({S_25: "This is a string"})).to.equal(true);
        expect(validate({keyword: "value"})).to.equal(true);
        expect(validate({keyword: 42})).to.equal(false);
      });
    });
  });
  describe("Array", () => {
    describe("Basic", () => {
      // https://json-schema.org/understanding-json-schema/reference/array.html#array
      it("should create a new jsonSchema", () => {
        const schema = JsonSchema.from({type: Array}).toObject();
        const validate = new Ajv().compile(schema);

        expect(schema).to.deep.equal({
          type: "array"
        });

        expect(validate([1, 2, 3, 4, 5])).to.equal(true);
        expect(validate([3, "different", {types: "of values"}])).to.equal(true);
        expect(validate({Not: "an array"})).to.equal(false);
      });
    });
    describe("Items", () => {
      // https://json-schema.org/understanding-json-schema/reference/array.html#items
      describe("List validation", () => {
        // https://json-schema.org/understanding-json-schema/reference/array.html#list-validation
        it("should create a new jsonSchema (items)", () => {
          const schema = JsonSchema.from({
            type: Array,
            items: JsonSchema.from({
              type: "number"
            })
          }).toObject();

          const validate = new Ajv().compile(schema);

          expect(schema).to.deep.equal({
            type: "array",
            items: {
              type: "number"
            }
          });

          expect(validate([1, 2, 3, 4, 5])).to.equal(true);
          expect(validate([3, "different", {types: "of values"}])).to.equal(false);
          expect(validate([])).to.equal(true);
        });

        it("should create a new jsonSchema (contains)", () => {
          const schema = JsonSchema.from({
            type: "array",
            contains: {
              type: "number"
            }
          }).toObject();

          const validate = new Ajv().compile(schema);

          expect(schema).to.deep.equal({
            type: "array",
            contains: {
              type: "number"
            }
          });

          expect(validate(["life", "universe", "everything", 42])).to.equal(true);
          expect(validate(["life", "universe", "everything", "forty-two"])).to.equal(false);
          expect(validate([1, 2, 3, 4, 5])).to.equal(true);
        });
      });
      describe("Tuple validation", () => {
        // https://json-schema.org/understanding-json-schema/reference/array.html#tuple-validation
        it("should create a new jsonSchema", () => {
          const schema = JsonSchema.from({
            type: "array",
            items: [
              {
                type: "number"
              },
              {
                type: "string"
              },
              {
                type: "string",
                enum: ["Street", "Avenue", "Boulevard"]
              },
              {
                type: "string",
                enum: ["NW", "NE", "SW", "SE"]
              }
            ]
          }).toObject();

          const validate = new Ajv().compile(schema);

          expect(schema).to.deep.equal({
            type: "array",
            items: [
              {
                type: "number"
              },
              {
                type: "string"
              },
              {
                type: "string",
                enum: ["Street", "Avenue", "Boulevard"]
              },
              {
                type: "string",
                enum: ["NW", "NE", "SW", "SE"]
              }
            ]
          });

          expect(validate([1600, "Pennsylvania", "Avenue", "NW"])).to.equal(true);
          expect(validate([24, "Sussex", "Drive"])).to.equal(false);
          expect(validate(["Palais de l'Élysée"])).to.equal(false);
          expect(validate([10, "Downing", "Street"])).to.equal(true);
          expect(validate([1600, "Pennsylvania", "Avenue", "NW", "Washington"])).to.equal(true);
        });
        it("should create a new jsonSchema (additionalItems=false)", () => {
          const schema = JsonSchema.from({
            type: "array",
            items: [
              {
                type: "number"
              },
              {
                type: "string"
              },
              {
                type: "string",
                enum: ["Street", "Avenue", "Boulevard"]
              },
              {
                type: "string",
                enum: ["NW", "NE", "SW", "SE"]
              }
            ],
            additionalItems: false
          }).toObject();

          const validate = new Ajv().compile(schema);

          expect(schema).to.deep.equal({
            type: "array",
            items: [
              {
                type: "number"
              },
              {
                type: "string"
              },
              {
                type: "string",
                enum: ["Street", "Avenue", "Boulevard"]
              },
              {
                type: "string",
                enum: ["NW", "NE", "SW", "SE"]
              }
            ],
            additionalItems: false
          });

          expect(validate([1600, "Pennsylvania", "Avenue", "NW"])).to.equal(true);
          expect(validate([1600, "Pennsylvania", "Avenue"])).to.equal(true);
          expect(validate([1600, "Pennsylvania", "Avenue", "NW", "Washington"])).to.equal(false);
        });
        it("should create a new jsonSchema (additionalItems=Schema)", () => {
          const schema = JsonSchema.from({
            type: "array",
            items: [
              {
                type: "number"
              },
              {
                type: "string"
              },
              {
                type: "string",
                enum: ["Street", "Avenue", "Boulevard"]
              },
              {
                type: "string",
                enum: ["NW", "NE", "SW", "SE"]
              }
            ],
            additionalItems: {type: "string"}
          }).toObject();

          const validate = new Ajv().compile(schema);

          expect(schema).to.deep.equal({
            type: "array",
            items: [
              {
                type: "number"
              },
              {
                type: "string"
              },
              {
                type: "string",
                enum: ["Street", "Avenue", "Boulevard"]
              },
              {
                type: "string",
                enum: ["NW", "NE", "SW", "SE"]
              }
            ],
            additionalItems: {type: "string"}
          });

          expect(validate([1600, "Pennsylvania", "Avenue", "NW"])).to.equal(true);
          expect(validate([1600, "Pennsylvania", "Avenue", "NW", 20500])).to.equal(false);
        });
      });
      describe("Length", () => {
        // https://json-schema.org/understanding-json-schema/reference/array.html#length
        it("should create a new jsonSchema", () => {
          const schema = JsonSchema.from({
            type: "array",
            minItems: 2,
            maxItems: 3
          }).toObject();

          const validate = new Ajv().compile(schema);

          expect(validate([])).to.equal(false);
          expect(validate([1])).to.equal(false);
          expect(validate([1, 2])).to.equal(true);
          expect(validate([1, 2, 3])).to.equal(true);
          expect(validate([1, 2, 3, 4])).to.equal(false);
        });
      });
      describe("Uniqueness", () => {
        // https://json-schema.org/understanding-json-schema/reference/array.html#uniqueness
        it("should create a new jsonSchema", () => {
          const schema = JsonSchema.from({
            type: "array",
            uniqueItems: true
          }).toObject();

          const validate = new Ajv().compile(schema);

          expect(validate([1, 2, 3, 4, 5])).to.equal(true);
          expect(validate([1, 2, 3, 3, 4])).to.equal(false);
          expect(validate([])).to.equal(true);
        });
      });
    });
  });
  describe("Boolean", () => {
    // https://json-schema.org/understanding-json-schema/reference/boolean.html
    it("should create a new jsonSchema", () => {
      const schema = JsonSchema.from({type: Boolean}).toObject();
      const validate = new Ajv().compile(schema);

      expect(schema).to.deep.equal({
        type: "boolean"
      });

      expect(validate(true)).to.equal(true);
      expect(validate(false)).to.equal(true);
      expect(validate("true")).to.equal(false);
      expect(validate(0)).to.equal(false);
    });
  });
  describe("Null", () => {
    it("should create a new jsonSchema", () => {
      const schema = JsonSchema.from({type: null}).toObject();

      expect(schema).to.deep.equal({
        type: "null"
      });

      const validate = new Ajv().compile(schema);

      expect(validate(null)).to.equal(true);
      expect(validate(false)).to.equal(false);
      expect(validate(0)).to.equal(false);
      expect(validate("")).to.equal(false);
    });
  });
  describe("Generic keywords", () => {
    // https://json-schema.org/understanding-json-schema/reference/generic.html#generic-keywords

    describe("Annotations", () => {
      // https://json-schema.org/understanding-json-schema/reference/generic.html#annotations
      it("should create a new jsonSchema", () => {
        const schema = JsonSchema.from({
          title: "Match anything",
          description: "This is a schema that matches anything.",
          default: "Default value",
          examples: ["Anything", 4035]
        }).toObject();

        expect(schema).to.deep.equal({
          title: "Match anything",
          description: "This is a schema that matches anything.",
          default: "Default value",
          examples: ["Anything", 4035]
        });
      });
    });

    describe("Enumerated values", () => {
      // https://json-schema.org/understanding-json-schema/reference/generic.html#enumerated-values
      it("should create a new jsonSchema", () => {
        const schema = JsonSchema.from({
          type: "string",
          enum: ["red", "amber", "green", "green"]
        }).toObject();

        expect(schema).to.deep.equal({
          type: "string",
          enum: ["red", "amber", "green"]
        });

        const validate = new Ajv().compile(schema);

        expect(validate("red")).to.equal(true);
        expect(validate("blue")).to.equal(false);
      });
      it("should create a new jsonSchema (without type)", () => {
        const schema = JsonSchema.from({
          enum: ["red", "amber", "green", null, 42]
        }).toObject();

        expect(schema).to.deep.equal({
          enum: ["red", "amber", "green", null, 42]
        });

        const validate = new Ajv().compile(schema);

        expect(validate("red")).to.equal(true);
        expect(validate(null)).to.equal(true);
        expect(validate(42)).to.equal(true);
        expect(validate(0)).to.equal(false);
      });
    });

    describe("Constant values", () => {
      // https://json-schema.org/understanding-json-schema/reference/generic.html#constant-values
      it("should create a new jsonSchema", () => {
        const schema = JsonSchema.from({
          properties: {
            country: {
              const: "United States of America"
            }
          }
        }).toObject();

        expect(schema).to.deep.equal({
          properties: {
            country: {
              const: "United States of America"
            }
          }
        });

        const validate = new Ajv().compile(schema);

        expect(validate({country: "United States of America"})).to.equal(true);
        expect(validate({country: "Canada"})).to.equal(false);
      });
    });

    describe("props", () => {
      it("should create a new jsonSchema", () => {
        const result = JsonSchema.from({
          type: String,
          $id: "$id",
          $schema: "$schema",
          default: "default",
          const: "const",
          description: "description",
          maxItems: 10,
          minItems: 0,
          uniqueItems: false,
          maxProperties: 0,
          minProperties: 1,
          multipleOf: 3,
          maximum: 4,
          exclusiveMaximum: 5,
          minimum: 6,
          exclusiveMinimum: 7,
          maxLength: 8,
          minLength: 9,
          title: "title"
        }).toObject();

        expect(result).to.deep.equal({
          type: "string",
          $id: "$id",
          $schema: "$schema",
          default: "default",
          const: "const",
          description: "description",
          maxItems: 10,
          minItems: 0,
          uniqueItems: false,
          maxProperties: 0,
          minProperties: 1,
          multipleOf: 3,
          maximum: 4,
          exclusiveMaximum: 5,
          minimum: 6,
          exclusiveMinimum: 7,
          maxLength: 8,
          minLength: 9,
          title: "title"
        });
      });
    });
  });
  describe("Combining Schema", () => {
    // https://json-schema.org/understanding-json-schema/reference/combining.html#combining-schemas
    describe("anyOf", () => {
      it("should create a new jsonSchema", () => {
        const schema = JsonSchema.from({
          anyOf: [
            {type: "string", maxLength: 5},
            {type: "number", minimum: 0}
          ]
        }).toObject();

        expect(schema).to.deep.equal({
          anyOf: [
            {type: "string", maxLength: 5},
            {type: "number", minimum: 0}
          ]
        });

        const validate = new Ajv().compile(schema);

        expect(validate("short")).to.equal(true);
        expect(validate("too long")).to.equal(false);
        expect(validate(12)).to.equal(true);
        expect(validate(-5)).to.equal(false);
      });
    });
    describe("allOf", () => {
      // https://json-schema.org/understanding-json-schema/reference/combining.html#allof
      it("should create a new jsonSchema", () => {
        const schema = JsonSchema.from({
          allOf: [
            {type: "string", maxLength: 5},
            {type: "number", minimum: 0}
          ]
        }).toObject();

        expect(schema).to.deep.equal({
          allOf: [
            {type: "string", maxLength: 5},
            {type: "number", minimum: 0}
          ]
        });

        const validate = new Ajv().compile(schema);

        expect(validate("short")).to.equal(false);
        expect(validate("too long")).to.equal(false);
      });
    });
    describe("oneOf", () => {
      // https://json-schema.org/understanding-json-schema/reference/combining.html#oneof
      it("should create a new jsonSchema", () => {
        const schema = JsonSchema.from({
          oneOf: [
            {type: "number", multipleOf: 5},
            {type: "number", multipleOf: 3}
          ]
        }).toObject();

        const validate = new Ajv().compile(schema);

        expect(validate(10)).to.equal(true);
        expect(validate(9)).to.equal(true);
        expect(validate(2)).to.equal(false);
        expect(validate(15)).to.equal(false);
      });
    });
    describe("not", () => {
      // https://json-schema.org/understanding-json-schema/reference/combining.html#not
      it("should create a new jsonSchema", () => {
        const schema = JsonSchema.from({not: {type: "string"}}).toObject();

        const validate = new Ajv().compile(schema);

        expect(validate(42)).to.equal(true);
        expect(validate({key: "value"})).to.equal(true);
        expect(validate("I am a string")).to.equal(false);
      });
    });
  });
  describe("Collection", () => {
    it("should create a new jsonSchema (Array)", () => {
      const result = JsonSchema.from({type: Array}).toObject();
      expect(JsonSchema.from({type: Array}).isCollection).to.equal(true);
      expect(result).to.deep.equal({
        type: "array"
      });
    });

    it("should create a new jsonSchema (Map)", () => {
      const result = JsonSchema.from({type: Map}).toObject();

      expect(result).to.deep.equal({
        type: "object"
      });
    });

    it("should create a new jsonSchema (Set)", () => {
      const result = JsonSchema.from({type: Set}).toObject();

      expect(result).to.deep.equal({
        type: "array",
        uniqueItems: true
      });
    });
  });
  describe("Class", () => {
    it("should create a new jsonSchema", () => {
      const result = JsonSchema.from({
        type: class Test {}
      }).toObject();

      expect(result).to.deep.equal({
        type: "object"
      });
    });
  });
  describe("Circular ref", () => {
    it("should create and validate schema", () => {
      const schema = JsonSchema.from({
        $ref: "#/definitions/Post",
        definitions: {
          Post: {
            type: "object",
            properties: {
              name: {
                type: "string"
              },
              owner: {
                $ref: "#/definitions/User"
              }
            }
          },
          User: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              posts: {
                type: "array",
                items: {
                  $ref: "#/definitions/Post"
                }
              }
            }
          }
        }
      }).toObject();

      const validate = new Ajv().compile(schema);

      expect(schema).to.deep.eq({
        $ref: "#/definitions/Post",
        definitions: {
          Post: {
            type: "object",
            properties: {
              name: {
                type: "string"
              },
              owner: {
                $ref: "#/definitions/User"
              }
            }
          },
          User: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              posts: {
                type: "array",
                items: {
                  $ref: "#/definitions/Post"
                }
              }
            }
          }
        }
      });

      expect(
        validate({
          id: "post-id",
          owner: {
            id: "user-id",
            posts: [
              {
                id: "post-id"
              }
            ]
          }
        })
      );
    });
  });
  describe("Alias", () => {
    it("should create new jsonSchema (useAlias = true)", () => {
      const schema = JsonSchema.from({
        type: "object",
        properties: {
          prop: {
            type: "string"
          }
        },
        required: ["prop"]
      }).addAlias("prop", "aliasProp");

      const jsonSchema = schema.toObject();

      expect(schema.getAliasOf("prop")).to.equal("aliasProp");
      expect(schema.getTarget()).to.equal(undefined);
      expect(jsonSchema).to.deep.equal({
        type: "object",
        properties: {
          aliasProp: {
            type: "string",
            minLength: 1
          }
        },
        required: ["aliasProp"]
      });
    });

    it("should create new jsonSchema (useAlias = false)", () => {
      const schema = JsonSchema.from({
        type: "object",
        properties: {
          prop: {
            type: "string"
          }
        },
        required: ["prop"]
      })
        .addAlias("prop", "aliasProp")
        .removeAlias("prop2")
        .toObject({useAlias: false});

      expect(schema).to.deep.equal({
        type: "object",
        properties: {
          prop: {
            type: "string",
            minLength: 1
          }
        },
        required: ["prop"]
      });
    });
  });
  describe("Mixed types", () => {
    it("should create a new jsonSchema", () => {
      const result = JsonSchema.from({type: [String, Number]}).toObject();

      expect(result).to.deep.equal({
        type: ["string", "number"]
      });
    });
    it("should create a new jsonSchema (2)", () => {
      const result = JsonSchema.from({type: ["string", "null"]}).toObject();

      expect(result).to.deep.equal({
        type: ["string", "null"]
      });
    });
  });

  describe("Any types", () => {
    it("should create a new jsonSchema", () => {
      const result = JsonSchema.from({type: Object}).any().toObject();

      expect(result).to.deep.equal({
        type: ["integer", "number", "string", "boolean", "array", "object", "null"]
      });
    });
  });
});
