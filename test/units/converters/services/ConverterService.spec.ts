import {assert, expect} from "chai";
import {BadRequest} from "ts-httpexceptions";
import {inject} from "../../../../src/testing/inject";
import {ConverterService, JsonProperty} from "../../../../src";

class Foo {

    test;
    foo;

    method() {
    }

    deserialize(obj) {

        Object.getOwnPropertyNames(obj).forEach((key) => {
            if (typeof this[key] !== "function") {
                this[key] = obj[key];
            }
        });

    }

    serialize() {
        return {
            test: this.test,
            foo: this.foo
        };
    }

}

class Foo2 {
    @JsonProperty()
    test: string;

    @JsonProperty("Name")
    name: string;

    @JsonProperty()
    dateStart: Date;

    @JsonProperty()
    uint: number;

    object: any;

    @JsonProperty()
    foo: Foo;

    @JsonProperty({use: Foo})
    foos: Foo[];

    @JsonProperty({use: Foo})
    theMap: Map<string, Foo>;

    @JsonProperty({use: Foo})
    theSet: Set<Foo>;

    method() {

    }
}

class Foo3 {
    toJSON() {
        return {};
    }
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
                }, <any>Foo);
            });

            after(() => delete this.foo);

            it("should be an instance of Foo", () =>
                expect(this.foo).to.be.instanceof(Foo)
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
                    ],
                    method: {}
                }, Foo2);
            });

            after(() => delete this.foo2);

            it("should be an instance of Foo2", () =>
                expect(this.foo2).to.be.instanceof(Foo2)
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
                expect(this.foo2.foo).to.be.instanceof(Foo);
                expect(this.foo2.foo.test).to.equals("2");
                expect(this.foo2.object.test).to.equals("2ez");
            });

            describe("Array", () => {
                it("should have an attribut that is deserialized as an Array", () =>
                    expect(this.foo2.foos).to.be.an("array")
                );

                it("should have an attribut that is deserialized as an Array with an item that is an instance of Foo", () =>
                    expect(this.foo2.foos[0]).to.be.instanceof(Foo)
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
                    this.foo2.theSet.forEach(item => {
                        expect(item).to.be.an("object");
                        expect(item.test).to.be.a("string");
                    });
                });
            });


        });

        describe("deserialization error", () => {
            it("should emit a BadRequest when the number parsing failed", () =>
                assert.throws(() => this.converterService.deserialize("NK1", Number), BadRequest)
            );
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
                const foo2 = new Foo2();
                foo2.dateStart = new Date();
                foo2.name = "Test";

                const foo = new Foo();
                foo.test = "test";

                foo2.foos = [foo];

                foo2.theMap = new Map<string, Foo>();
                foo2.theMap.set("newKey", foo);

                foo2.theSet = new Set<Foo>();
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
            before(() => this.foo = this.converterService.serialize(new Foo3()));
            after(() => delete this.foo);

            it("should use toJSON method", () => {
                expect(this.foo).to.be.an("object");
            });
        });
    });
});