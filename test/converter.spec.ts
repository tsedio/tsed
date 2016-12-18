import * as Chai from "chai";
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
                this[key] = obj[key];//ConverterService.deserialize(obj[key], obj[key].constructor);
            }
        });

    }

}

class Foo2 {
    @JsonProperty()
    test: string;

    @JsonProperty('Name')
    name: string;

    @JsonProperty()
    dateStart: Date;

    object: any;

    @JsonProperty()
    foo: Foo;

    @JsonProperty({use: Foo})
    foos: Foo[];

    @JsonProperty({use: Foo})
    theMap: Map<string, Foo>;

    @JsonProperty({use: Foo})
    theSet: Set<Foo>;

    @JsonProperty({use: Foo})
    theWeakMap: WeakMap<string, Foo>;

    @JsonProperty({use: Foo})
    theWeakSet: WeakSet<Foo>;

    method(){

    }
}

describe("ConverterService :", () => {

    describe("ConverterService.deserialize", () => {

        it("should do nothing when type is not deserializable", inject([ConverterService], (converterService: ConverterService) => {

            expect(converterService.deserialize({}, Object)).to.be.an('object');
            expect(converterService.deserialize(true, Boolean)).to.be.a('boolean');
            expect(converterService.deserialize(1, Number)).to.be.a('number');
            //expect(converterService.deserialize(new Date(), Date)).to.be.instanceof(Date);

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

                /*theWeakMap: {
                    f1: {test: "1"}
                },*/

                theSet: [
                    {test:"13"},
                    {test:"1re"}
                ],

                /*theWeakSet: [
                    {test:"13"},
                    {test:"1re"}
                ],*/

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



});