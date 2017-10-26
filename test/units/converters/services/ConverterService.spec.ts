import {ConverterService} from "../../../../src";
import {inject} from "../../../../src/testing/inject";
import {JsonFoo, JsonFoo2, JsonFoo3, JsonFoo4} from "../../../helper/classes";
import {assert, expect} from "../../../tools";
import {JsonProperty} from "../../../../src/jsonschema/decorators/jsonProperty";

class JsonFoo5 {
    @JsonProperty()
    test: any;
    foo: any;
}

describe("ConverterService", () => {

    before(inject([ConverterService], (converterService: ConverterService) => {
        this.converterService = converterService;
    }));

    after(() => delete this.converterService);

    describe("deserialize()", () => {
        describe("primitive", () => {

            it("should convert boolean to Boolean", () => {
                expect(this.converterService.deserialize(true, Boolean)).to.be.equal(true);
                expect(this.converterService.deserialize(false, Boolean)).to.be.equal(false);
            });

            it("should convert boolean string to Boolean", () => {
                expect(this.converterService.deserialize("true", Boolean)).to.be.equal(true);
                expect(this.converterService.deserialize("false", Boolean)).to.be.equal(false);
            });

            it("should convert empty string to Boolean", () => {
                expect(this.converterService.deserialize("", Boolean)).to.be.equal(false);
            });

            it("should convert string to Boolean", () => {
                expect(this.converterService.deserialize("test", Boolean)).to.be.equal(true);
            });

            it("should convert number to Boolean", () => {
                expect(this.converterService.deserialize(0, Boolean)).to.be.equal(false);
                expect(this.converterService.deserialize(1, Boolean)).to.be.equal(true);
            });

            it("should convert null to Boolean", () => {
                expect(this.converterService.deserialize(null, Boolean)).to.be.equal(false);
            });

            it("should convert undefined to Boolean", () => {
                expect(this.converterService.deserialize(undefined, Boolean)).to.be.equal(false);
            });

            it("should convert a string to Number", () => {
                expect(this.converterService.deserialize("1", Number)).to.be.a("number").and.to.equals(1);
            });

            it("should convert number to Number", () => {
                expect(this.converterService.deserialize(1, Number)).to.be.a("number").and.to.equals(1);
            });

            it("should convert a string to String", () => {
                expect(this.converterService.deserialize("1", String)).to.be.a("string").and.to.equals("1");
            });

            it("should convert number to String", () => {
                expect(this.converterService.deserialize(1, String)).to.be.a("string").and.to.equals("1");
            });

        });

        describe("object", () => {
            it("should convert object", () =>
                expect(this.converterService.deserialize({}, Object)).to.be.an("object")
            );

            it("should convert a date", inject([ConverterService], (converterService: ConverterService) => {
                expect(converterService.deserialize(new Date().toISOString(), Date)).to.be.instanceof(Date);
            }));
        });

        describe("class Foo", () => {

            before(() => {
                this.foo = this.converterService.deserialize({
                    test: 1,
                    foo: "test"
                }, <any>JsonFoo);
            });

            after(() => delete this.foo);

            it("should be an instance of Foo", () =>
                expect(this.foo).to.be.instanceof(JsonFoo)
            );

            it("should have method named 'method'", () => {
                expect(this.foo.method).to.be.a("function");
            });

            it("should have some attributs", () => {
                expect(this.foo.test).to.be.a("number").and.to.equals(1);
                expect(this.foo.foo).to.be.a("string").and.to.equals("test");
            });

        });

        describe("class Foo2", () => {
            before(() => {
                this.foo2 = this.converterService.deserialize({
                    test: "testField",
                    Name: "nameField",
                    dateStart: new Date().toISOString(),
                    object: {test: "2ez"},
                    foo: {
                        test: "2"
                    },
                    foos: [
                        {
                            test: "1"
                        },
                        {
                            test: "2"
                        }
                    ],
                    theMap: {
                        f1: {test: "1"}
                    },
                    theSet: [
                        {test: "13"},
                        {test: "1re"}
                    ]
                }, JsonFoo2);
            });

            after(() => delete this.foo2);

            it("should be an instance of Foo2", () =>
                expect(this.foo2).to.be.instanceof(JsonFoo2)
            );

            it("should preserve method", () =>
                expect(this.foo2.method).to.be.a("function")
            );

            it("should have some attributs", () => {
                expect(this.foo2.dateStart).to.be.instanceof(Date);
                expect(this.foo2.name).to.be.a("string");
                expect(this.foo2.name).to.equals("nameField");
            });

            it("should have an attribut that is deserialized as Foo instance", () => {
                expect(this.foo2.foo).to.be.instanceof(JsonFoo);
                expect(this.foo2.foo.test).to.equals("2");
                expect(this.foo2.object.test).to.equals("2ez");
            });

            describe("Array", () => {
                it("should have an attribut that is deserialized as an Array", () =>
                    expect(this.foo2.foos).to.be.an("array")
                );

                it(
                    "should have an attribut that is deserialized as an Array with an item that is an instance of Foo", () =>
                        expect(this.foo2.foos[0]).to.be.instanceof(JsonFoo)
                );
            });

            describe("Map", () => {
                it("should have an attribut that is deserialized as a Map", () =>
                    expect(this.foo2.theMap).to.be.instanceof(Map)
                );

                it("should have an attribut that is deserialized as a Map and have a method", () => {
                    expect(this.foo2.theMap.get("f1")).to.be.an("object");
                    expect(this.foo2.theMap.get("f1").test).to.equals("1");
                });
            });

            describe("Set", () => {
                it("should have an attribut that is deserialized as a Set", () =>
                    expect(this.foo2.theSet).to.be.instanceof(Set)
                );

                it("should have an attribut that is deserialized as a Set and have a method", () => {
                    this.foo2.theSet.forEach((item: any) => {
                        expect(item).to.be.an("object");
                        expect(item.test).to.be.a("string");
                    });
                });
            });


        });

        describe("deserialization error", () => {
            it("should emit a BadRequest when the number parsing failed", () =>
                assert.throws(() => this.converterService.deserialize("NK1", Number), "Cast error. Expression value is not a number.")
            );
        });

        describe("when validationModelStrict is enabled", () => {
            before(() => {
                this.converterService.validationModelStrict = true;
            });
            it("should emit a BadRequest when a property is not in the Model", () => {
                assert.throws(() =>
                        this.converterService.deserialize({
                            test: 1,
                            foo: "test",
                            notPropertyAllowed: "tst"
                        }, <any>JsonFoo4),
                    "Property notPropertyAllowed on class JsonFoo4 is not allowed."
                );
            });
        });

        describe("when validationModelStrict is disabled", () => {
            before(() => {
                this.converterService.validationModelStrict = false;
            });
            after(() => {
                this.converterService.validationModelStrict = true;
            });

            it("should not emit a BadRequest", () => {
                const foo = new JsonFoo5();
                Object.assign(foo, {
                    "foo": "test",
                    "notPropertyAllowed": "tst",
                    "test": 1
                });

                expect(this.converterService.deserialize({
                    test: 1,
                    foo: "test",
                    notPropertyAllowed: "tst"
                }, <any>JsonFoo5)).to.deep.eq(foo);
            });
        });

        describe("when an attribute is required", () => {
            it("should throw a bad request (undefined value)", () => {
                assert.throws(() => this.converterService.deserialize({
                    test: undefined
                }, JsonFoo2), "Property test on class JsonFoo2 is required.");
            });

            it("should throw a bad request (null value)", () => {
                assert.throws(() => this.converterService.deserialize({
                    test: null
                }, JsonFoo2), "Property test on class JsonFoo2 is required.");
            });

            it("should throw a bad request (empty value)", () => {
                assert.throws(() => this.converterService.deserialize({
                    test: ""
                }, JsonFoo2), "Property test on class JsonFoo2 is required.");
            });
        });
    });

    describe("serialize()", () => {
        describe("primitive", () => {
            it("should convert empty string to string", () =>
                expect(this.converterService.serialize("")).to.be.a("string")
            );
            it("should convert undefined to undefined", () =>
                expect(this.converterService.serialize(undefined)).to.equals(undefined)
            );
            it("should convert boolean to a boolean", () =>
                expect(this.converterService.serialize(true)).to.be.a("boolean").and.to.equal(true)
            );
            it("should convert number to a number", () =>
                expect(this.converterService.serialize(1)).to.be.a("number").and.to.equal(1)
            );
            it("should convert string to a string", () =>
                expect(this.converterService.serialize("1")).to.be.a("string").and.to.equal("1")
            );
        });

        describe("object", () => {
            it("should convert object to an object", () =>
                expect(this.converterService.serialize({})).to.be.an("object")
            );

            it("should convert date to a string", () =>
                expect(this.converterService.serialize(new Date)).to.be.a("string")
            );
        });

        describe("class Foo2", () => {
            before(() => {
                const foo2 = new JsonFoo2();
                foo2.dateStart = new Date();
                foo2.test = "Test";
                foo2.name = "Test";

                const foo = new JsonFoo();
                foo.test = "test";

                foo2.foos = [foo];
                foo2.foo = foo;

                foo2.theMap = new Map<string, JsonFoo>();
                foo2.theMap.set("newKey", foo);

                foo2.theSet = new Set<JsonFoo>();
                foo2.theSet.add(foo);

                this.foo = this.converterService.serialize(foo2);
                this.foo2 = foo2;
            });

            after(() => {
                delete this.foo;
                delete this.foo2;
            });

            it("should have an attribut with date type", () => {
                expect(this.foo.dateStart)
                    .to.be.a("string")
                    .and.to.equals(this.foo2.dateStart.toISOString());
            });

            it("should have an attribut Name (because metadata said Name instead of name)", () => {
                expect(this.foo.Name).to.be.a("string").and.to.equals("Test");
            });

            it("should haven't an attribut name (because metadata said Name instead of name)", () => {
                expect(this.foo.name).to.equals(undefined);
            });

            it("should have an attribut with array type", () =>
                expect(this.foo.foos).to.be.an("array")
            );

            it("should have an attribut with array type and an item serialized", () => {
                expect(this.foo.foos[0]).to.be.an("object");
                expect(this.foo.foos[0].test).to.equals("test");
            });

            it("should have an attribut with Map type", () => {
                expect(this.foo.theMap).to.be.an("object");
            });

            it("should have an attribut with Map type and an item serialized", () => {
                expect(this.foo.theMap.newKey).to.be.an("object");
                expect(this.foo.theMap.newKey.test).to.equals("test");
            });

            it("should have an attribut with Set type", () => {
                expect(this.foo.theSet).to.be.an("array");
            });

            it("should have an attribut with Set type and an item serialized", () => {
                expect(this.foo.theSet[0]).to.be.an("object");
                expect(this.foo.theSet[0].test).to.equals("test");
            });

            describe("use toJson()", () => {
                before(() => {
                    this.fooJson = JSON.parse(JSON.stringify(this.foo2));
                });
                after(() => delete this.fooJSON);

                it("should have an attribut with date type", () => {
                    expect(this.fooJson.dateStart)
                        .to.be.a("string")
                        .and.to.equals(this.foo2.dateStart.toISOString());
                });

                it("should have an attribut Name (because metadata said Name instead of name)", () => {
                    expect(this.fooJson.Name).to.be.a("string").and.to.equals("Test");
                });

                it("should haven't an attribut name (because metadata said Name instead of name)", () => {
                    expect(this.fooJson.name).to.equals(undefined);
                });

                it("should have an attribut with array type", () =>
                    expect(this.fooJson.foos).to.be.an("array")
                );

                it("should have an attribut with array type and an item serialized", () => {
                    expect(this.fooJson.foos[0]).to.be.an("object");
                    expect(this.fooJson.foos[0].test).to.equals("test");
                });

                it("should have an attribut with Map type", () => {
                    expect(this.fooJson.theMap).to.be.an("object");
                });

                it("should have an attribut with Map type and an item serialized", () => {
                    expect(this.fooJson.theMap.newKey).to.be.an("object");
                    expect(this.fooJson.theMap.newKey.test).to.equals("test");
                });

                it("should have an attribut with Set type", () => {
                    expect(this.fooJson.theSet).to.be.an("array");
                });

                it("should have an attribut with Set type and an item serialized", () => {
                    expect(this.fooJson.theSet[0]).to.be.an("object");
                    expect(this.fooJson.theSet[0].test).to.equals("test");
                });
            });
        });

        describe("class Foo3", () => {
            before(() => this.foo = this.converterService.serialize(new JsonFoo3()));
            after(() => delete this.foo);

            it("should use toJSON method", () => {
                expect(this.foo).to.be.an("object");
            });
        });

        describe("serialization error", () => {
            it("should emit a BadRequest when attribute is required", () =>
                assert.throws(
                    () => {
                        const foo4: any = new JsonFoo4();
                        this.converterService.serialize(foo4);
                    },
                    "Property foo on class JsonFoo4 is required."
                )
            );

            it("should emit a BadRequest when attribute is not allowed", () =>
                assert.throws(
                    () => {
                        const foo4: any = new JsonFoo4();
                        foo4.unknowProperty = "test";
                        this.converterService.serialize(foo4);
                    },
                    "Property unknowProperty on class JsonFoo4 is not allowed."
                )
            );
        });
    });
});