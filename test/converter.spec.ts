import * as Chai from "chai";
import {BadRequest} from "ts-httpexceptions";
import assert = require('assert');
import {inject} from '../src/testing/inject';
import {JsonProperty, ConverterService} from "../src";

let expect: Chai.ExpectStatic = Chai.expect;

class Foo {

    test;
    foo;

    method(){}

    deserialize(obj) {

        Object.getOwnPropertyNames(obj).forEach((key) => {
            if(typeof this[key] !== 'function') {
                this[key] = obj[key];
            }
        });

    }

    serialize() {
        return {
            test: this.test,
            foo: this.foo
        }
    }

}

class Foo2 {
    @JsonProperty()
    test: string;

    @JsonProperty('Name')
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

    method(){

    }
}

describe("ConverterService :", () => {

    describe("ConverterService.deserialize", () => {

        it("should convert primitive type correctly", inject([ConverterService], (converterService: ConverterService) => {

            expect(converterService.deserialize({}, Object)).to.be.an('object');

            expect(converterService.deserialize(true, Boolean)).to.be.equal(true);
            expect(converterService.deserialize(false, Boolean)).to.be.equal(false);
            expect(converterService.deserialize("true", Boolean)).to.be.equal(true);
            expect(converterService.deserialize("false", Boolean)).to.be.equal(false);

            expect(converterService.deserialize("", Boolean)).to.be.equal(false);
            expect(converterService.deserialize(0, Boolean)).to.be.equal(false);
            expect(converterService.deserialize(null, Boolean)).to.be.equal(false);
            expect(converterService.deserialize(undefined, Boolean)).to.be.equal(false);
            expect(converterService.deserialize("test", Boolean)).to.be.equal(true);

            expect(converterService.deserialize("1", Number)).to.be.a('number');
            expect(converterService.deserialize(1, Number)).to.be.a('number');

            expect(converterService.deserialize("1", String)).to.be.a('string');
            expect(converterService.deserialize(1, String)).to.be.a('string');
        }));


        it("should throw a BadRequest when parsing a number failed", inject([ConverterService], (converterService: ConverterService) => {

            try {
                converterService.deserialize("NK1", Number);
                assert.ok(false);
            } catch(er){
                expect(er instanceof BadRequest).to.be.true;
            }

        }));

        it("should do deserialize a date", inject([ConverterService], (converterService: ConverterService) => {

            const result = converterService.deserialize(new Date().toISOString(), Date);
            expect(result).to.be.instanceof(Date);

        }));

        it("should do deserialize from custom deserialize method (class)", inject([ConverterService], (converterService: ConverterService) => {

            const result: Foo = converterService.deserialize({
                test: 1,
                foo: "test"
            }, <any>Foo);

            expect(result).to.be.instanceof(Foo);
            expect(result.method).to.be.a('function');
            expect(result.test).to.equals(1);
            expect(result.foo).to.equals("test");

        }));

        it("should do deserialize an object to a class", inject([ConverterService], (converterService: ConverterService) => {

            const result: Foo2 = converterService.deserialize({
                test: "testField",
                Name: "nameField",
                dateStart: new Date().toISOString(),
                object: {test: '2ez'},
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
                    {test:"13"},
                    {test:"1re"}
                ],
                method: {}
            }, Foo2);

            expect(result).to.be.instanceof(Foo2);
            expect(result.dateStart).to.be.instanceof(Date);
            expect(result.name).to.be.a('string');
            expect(result.name).to.equals("nameField");
            expect(result.object.test).to.equals("2ez");
            expect(result.foo).to.be.instanceof(Foo);
            expect(result.foo.test).to.equals("2");

            // Array deserialization
            expect(result.foos).to.be.an('array');
            expect(result.foos[0]).to.be.instanceof(Foo);

            // Map deserialization
            expect(result.theMap).to.be.instanceof(Map);
            expect(result.theMap.get('f1')).to.be.an('object');
            expect(result.theMap.get('f1').test).to.equals('1');

            // Set deserialization
            expect(result.theSet).to.be.instanceof(Set);

            result.theSet.forEach(item => {
                expect(item).to.be.an('object');
                expect(item.test).to.be.a('string');
            });

            // Preserve method
            expect(result.method).to.be.a('function');

        }));

    });

    describe("ConverterService.serialize", () => {


        it("should do nothing when type is not serializable", inject([ConverterService], (converterService: ConverterService) => {

            expect(converterService.serialize("")).to.be.an('string');
            expect(converterService.serialize(undefined)).to.equals(undefined);

            expect(converterService.serialize({})).to.be.an('object');
            expect(converterService.serialize(true)).to.be.a('boolean');
            expect(converterService.serialize(1)).to.be.a('number');
            expect(converterService.serialize("1")).to.be.a('string');

        }));

        it("should do serialize a date", inject([ConverterService], (converterService: ConverterService) => {

            const result = converterService.serialize(new Date());
            expect(result).to.be.a("string");

        }));

        it("should do serialize a class to object", inject([ConverterService], (converterService: ConverterService) => {

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

            const result = converterService.serialize(foo2);

            expect(result.dateStart).to.be.a('string');
            expect(result.dateStart).to.equals(foo2.dateStart.toISOString());

            expect(result.Name).to.be.a('string');
            expect(result.name).to.equals(undefined);
            expect(result.Name).to.equals("Test");

            expect(result.foos).to.be.an('array');
            expect(result.foos[0]).to.be.an('object');
            expect(result.foos[0].test).to.equals('test');

            expect(result.theMap).to.be.an('object');
            expect(result.theMap.newKey).to.be.an('object');
            expect(result.theMap.newKey.test).to.equals('test');

            expect(result.theSet).to.be.an('array');
            expect(result.theSet[0]).to.be.an('object');
            expect(result.theSet[0].test).to.equals('test');


        }));
    });


    describe('toJson', () => {

        it('should convert class to json with the right attribut', () => {
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


            const result = JSON.parse(JSON.stringify(foo2));

            expect(result.dateStart).to.be.a('string');
            expect(result.dateStart).to.equals(foo2.dateStart.toISOString());

            expect(result.Name).to.be.a('string');
            expect(result.name).to.equals(undefined);
            expect(result.Name).to.equals("Test");

            expect(result.foos).to.be.an('array');
            expect(result.foos[0]).to.be.an('object');
            expect(result.foos[0].test).to.equals('test');

            expect(result.theMap).to.be.an('object');
            expect(result.theMap.newKey).to.be.an('object');
            expect(result.theMap.newKey.test).to.equals('test');

            expect(result.theSet).to.be.an('array');
            expect(result.theSet[0]).to.be.an('object');
            expect(result.theSet[0].test).to.equals('test');


        });

    })
});