import {getContructor, nameOfClass} from "../../../../src";

import {
    applyBefore,
    deepExtends,
    getClass,
    getClassOrSymbol,
    isArrayOrArrayClass,
    isCollection,
    isEmpty,
    isPrimitiveOrPrimitiveClass,
    nameOf,
    promiseTimeout
} from "../../../../src/core/utils/index";
import {expect, Sinon} from "../../../tools";

class Test {

}

const sym = Symbol("test2");

describe("Utils", () => {

    describe("getContructor()", () => {
        it("should return the constructor when class is given", () => {
            expect(getContructor(Test)).to.eq(Test);
        });
        it("should return the constructor when instance is given", () => {
            expect(getContructor(new Test)).to.eq(Test);
        });
    });

    describe("getClass()", () => {
        it("should return the class when class is given", () => {
            expect(getClass(Test)).to.eq(Test);
        });

        it("should return the class when instance is given", () => {
            expect(getClass(new Test)).to.eq(Test);
        });

        it("should return the class when prototype is given", () => {
            expect(getClass(Test.prototype)).to.eq(Test);
        });
    });

    describe("getClassOrSymbol()", () => {
        it("should return the class when class is given", () => {
            expect(getClassOrSymbol(Test)).to.eq(Test);
        });
        it("should return the class when class is symbol", () => {
            expect(getClassOrSymbol(sym)).to.eq(sym);
        });
    });

    describe("isPrimitiveOrPrimitiveClass()", () => {
        it("should return true when a primitive is given", () => {
            expect(isPrimitiveOrPrimitiveClass("test")).to.eq(true);
        });
        it("should return true when a PrimitiveClass is given", () => {
            expect(isPrimitiveOrPrimitiveClass(new String())).to.eq(true);
        });

        it("should return false when a class is given", () => {
            expect(isPrimitiveOrPrimitiveClass(Test)).to.eq(false);
        });
    });

    describe("isArrayOrArrayClass()", () => {
        it("should return true when Array is given", () => {
            expect(isArrayOrArrayClass(Array)).to.eq(true);
        });

        it("should return true when Array is given", () => {
            expect(isArrayOrArrayClass(new Array())).to.eq(true);
        });

        it("should return true when [] is given", () => {
            expect(isArrayOrArrayClass([])).to.eq(true);
        });

        it("should return false when {} is given", () => {
            expect(isArrayOrArrayClass({})).to.eq(false);
        });
    });

    describe("isCollection()", () => {
        it("should return true when Array is given", () => {
            expect(isCollection(Array)).to.eq(true);
        });

        it("should return true when Array is given", () => {
            expect(isCollection(new Array())).to.eq(true);
        });

        it("should return true when [] is given", () => {
            expect(isCollection([])).to.eq(true);
        });

        it("should return true when Map is given", () => {
            expect(isCollection(Map)).to.eq(true);
        });

        it("should return true when Set is given", () => {
            expect(isCollection(Set)).to.eq(true);
        });

        it("should return true when WeakMap is given", () => {
            expect(isCollection(WeakMap)).to.eq(true);
        });

        it("should return true when WeakSet is given", () => {
            expect(isCollection(WeakSet)).to.eq(true);
        });

        it("should return false when {} is given", () => {
            expect(isCollection({})).to.eq(false);
        });

    });

    describe("isEmpty()", () => {
        it("should return true when empty string is given", () => {
            expect(isEmpty("")).to.eq(true);
        });
        it("should return true when null is given", () => {
            expect(isEmpty(null)).to.eq(true);
        });

        it("should return true when empty string is given", () => {
            expect(isEmpty(undefined)).to.eq(true);
        });
        it("should return false when {} is given", () => {
            expect(isEmpty({})).to.eq(false);
        });
        it("should return false when [] is given", () => {
            expect(isEmpty([])).to.eq(false);
        });

        it("should return false when false is given", () => {
            expect(isEmpty(false)).to.eq(false);
        });
    });

    describe("nameOf", () => {
        it("should return name when class is given", () => {
            expect(nameOf(Test)).to.eq("Test");
        });
        it("should return name when symbol is given", () => {
            expect(nameOf(sym)).to.eq("test2");
        });
        it("should return name when string is given", () => {
            expect(nameOf("test")).to.eq("test");
        });
        it("should return name when string is given", () => {
            expect(nameOf(1)).to.eq("1");
        });
        it("should return name when string is given", () => {
            expect(nameOf(true)).to.eq("true");
        });
        it("should return name when null is given", () => {
            expect(nameOf(null)).to.eq("null");
        });
        it("should return name when undefined is given", () => {
            expect(nameOf(undefined)).to.eq("undefined");
        });
    });

    describe("nameOfClass", () => {
        it("should return name when class is given", () => {
            expect(nameOfClass(Test)).to.eq("Test");
        });
        it("should return name when instance is given", () => {
            expect(nameOfClass(new Test)).to.eq("Test");
        });
    });

    describe("deepExtends", () => {
        describe("without reducers", () => {
            describe("when is an object", () => {

                it("should merge data", () => {
                    expect(deepExtends(
                        {
                            "security": ["o"]
                        },
                        {
                            "security": ["o", "o1"]
                        })
                    ).to.deep.eq(
                        {
                            "security": [
                                "o",
                                "o",
                                "o1"
                            ]
                        }
                    );
                });

                it("should merge data", () => {
                    expect(deepExtends(
                        {
                            "security": [{"1": "o"}]
                        },
                        {
                            "security": [{"1": "o"}, {"2": "o1"}]
                        })
                    ).to.deep.eq(
                        {
                            "security": [
                                {"1": "o"},
                                {"1": "o"},
                                {"2": "o1"}
                            ]
                        }
                    );
                });

            });

            describe("when is an array", () => {

                it("should merge data", () => {
                    expect(deepExtends(
                        [
                            "1", "2", "4"
                        ],
                        [
                            "1", "2", "3"
                        ])
                    ).to.deep.eq(
                        ["1", "2", "4", "1", "2", "3"]
                    );
                });

                it("should merge data", () => {
                    expect(deepExtends(
                        [
                            {"1": "1"}, {"2": "2"}, {"4": "4"}
                        ],
                        [
                            {"1": "1"}, {"2": "2"}, {"3": "3"}
                        ])
                    ).to.deep.eq(
                        [{"1": "1"}, {"2": "2"}, {"4": "4"}, {"1": "1"}, {"2": "2"}, {"3": "3"}]
                    );
                });

            });
        });

        describe("with reducers", () => {
            describe("when is an object", () => {

                it("should merge data", () => {
                    expect(deepExtends(
                        {
                            "security": ["o"]
                        },
                        {
                            "security": ["o", "o1"]
                        },
                        {
                            "default": (collection, value) => {
                                if (collection.indexOf(value) === -1) {
                                    collection.push(value);
                                }
                                return collection;
                            }
                        })
                    ).to.deep.eq(
                        {
                            "security": [
                                "o",
                                "o1"
                            ]
                        }
                    );
                });

                it("should merge data", () => {
                    expect(deepExtends(
                        {
                            "parameters": [
                                {"in": "test", "name": "get", "description": "test"},
                                {"in": "test", "name": "post", "description": "test"}
                            ]
                        },
                        {
                            "parameters": [
                                {"in": "test", "name": "get", "description": "test2"},
                                {"in": "test", "name": "util", "description": "test2"}
                            ]
                        },
                        {
                            "parameters": (collection, value) => {

                                const current = collection.find((current) =>
                                    current.in === value.in && current.name === value.name
                                );

                                if (current) {
                                    deepExtends(current, value);
                                } else {
                                    collection.push(value);
                                }

                                return collection;
                            }
                        })
                    ).to.deep.eq(
                        {
                            "parameters": [
                                {"in": "test", "name": "get", "description": "test2"},
                                {"in": "test", "name": "post", "description": "test"},
                                {"in": "test", "name": "util", "description": "test2"}
                            ]
                        }
                    );
                });

            });

            describe("when is an array", () => {

                it("should merge data", () => {
                    expect(deepExtends(
                        [
                            "1", "2", "4"
                        ],
                        [
                            "1", "2", "3"
                        ])
                    ).to.deep.eq(
                        ["1", "2", "4", "1", "2", "3"]
                    );
                });

                it("should merge data", () => {
                    expect(deepExtends(
                        [
                            {"1": "1"}, {"2": "2"}, {"4": "4"}
                        ],
                        [
                            {"1": "1"}, {"2": "2"}, {"3": "3"}
                        ])
                    ).to.deep.eq(
                        [{"1": "1"}, {"2": "2"}, {"4": "4"}, {"1": "1"}, {"2": "2"}, {"3": "3"}]
                    );
                });

            });
        });
    });

    describe("applyBefore", () => {
        before(() => {
            this.originalMethod = Sinon.stub();
            this.originalMethod.returns("returns");
            this.object = {
                method: this.originalMethod
            };
            this.cbStub = Sinon.stub();

            applyBefore(this.object, "method", this.cbStub);
            this.result = this.object.method("arg", "arg2");
        });

        it("should override the original method", () => {
            this.object.method.should.not.eq(this.originalMethod);
        });
        it("should have been called the callback", () => {
            this.cbStub.should.be.calledOnce.and.calledWithExactly("arg", "arg2");
        });
        it("should have been called the originalMethod", () => {
            this.originalMethod.should.be.calledOnce.and.calledWithExactly("arg", "arg2");
        });
        it("should return the value return by the originalMethod", () => {
            this.result.should.be.eq("returns");
        });
    });

    describe("promiseTimeout()", () => {
        describe("when there is a timeout", () => {
            before(() => {
                return this.result = promiseTimeout(new Promise(() => {
                }), 500);
            });

            it("should return a response with a no ok", () => {
                return this.result.should.eventually.deep.eq({
                    ok: false
                });
            });
        });

        describe("when success", () => {
            before(() => {
                return this.result = promiseTimeout(new Promise((resolve) => resolve("test")), 500);
            });

            it("should return a response with a ok", () => {
                return this.result.should.eventually.deep.eq({
                    ok: true,
                    response: "test"
                });
            });
        });
    });
});