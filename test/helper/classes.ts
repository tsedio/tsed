import {Property} from "../../src/common/jsonschema/decorators/jsonProperty";
import {MinLength} from "../../src/common/jsonschema/decorators/minLength";
import {PropertyName} from "../../src/common/jsonschema/decorators/propertyName";
import {PropertyType} from "../../src/common/jsonschema/decorators/propertyType";
import {Required} from "../../src/common/mvc/decorators";

export class JsonBaseModel {

    @Property()
    public id?: string;
}

export class JsonNameModel extends JsonBaseModel {

    @Property()
    public name: string;
}

export class JsonAgeModel extends JsonBaseModel {

    @Property()
    public age: number;
}


export class JsonFoo {
    test: any;
    foo: any;

    method() {
    }

    deserialize(obj: any) {
        const self: any = this;

        Object.getOwnPropertyNames(obj).forEach((key) => {
            if (typeof self[key] !== "function") {
                self[key] = obj[key];
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

export class JsonFoo2 {
    @Property()
    @Required()
    @MinLength(3)
    test: string;


    @Property()
    @PropertyName("Name")
    @MinLength(3)
    name: string;

    @Property()
    dateStart: Date;

    @Property()
    uint: number;

    @Property()
    object: any;

    @Required()
    foo: JsonFoo;

    @PropertyType(JsonFoo)
    foos: JsonFoo[];

    @PropertyType(JsonFoo)
    theMap: Map<string, JsonFoo>;

    @PropertyType(JsonFoo)
    theSet: Set<JsonFoo>;

    @PropertyType(String)
    mapOfString: Map<string, string>;

    @PropertyType(String)
    arrayOfString: string[];

    @Property()
    nameModel: JsonNameModel;

    @Property()
    ageModel: JsonAgeModel;

    method() {

    }
}

export class JsonFoo3 {
    toJSON() {
        return {};
    }
}

export class JsonFoo4 {
    @Property()
    test: any;

    @Required()
    foo: any;
}

export class Nested {
    @Property()
    count?: number;
}

export class Stuff {
    @Property()
    name: string;

    @Property()
    nested?: Nested;
}

export class Thingy {
    @Property()
    stuff?: Stuff;
}


