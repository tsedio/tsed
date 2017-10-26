import {JsonProperty} from "../../src/jsonschema/decorators/jsonProperty";
import {Required} from "../../src/mvc/decorators";

export class JsonBaseModel {

    @JsonProperty()
    public id?: string;
}

export class JsonNameModel extends JsonBaseModel {

    @JsonProperty()
    public name: string;
}

export class JsonAgeModel extends JsonBaseModel {

    @JsonProperty()
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
    @JsonProperty()
    @Required()
    test: string;

    @JsonProperty("Name")
    name: string;

    @JsonProperty()
    dateStart: Date;

    @JsonProperty()
    uint: number;

    @JsonProperty()
    object: any;

    @JsonProperty()
    @Required()
    foo: JsonFoo;

    @JsonProperty({use: JsonFoo})
    foos: JsonFoo[];

    @JsonProperty({use: JsonFoo})
    theMap: Map<string, JsonFoo>;

    @JsonProperty({use: JsonFoo})
    theSet: Set<JsonFoo>;

    @JsonProperty({use: String})
    mapOfString: Map<string, string>;

    @JsonProperty({use: String})
    arrayOfString: string[];

    @JsonProperty()
    nameModel: JsonNameModel;

    @JsonProperty()
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
    @JsonProperty()
    test: any;

    @JsonProperty()
    @Required()
    foo: any;
}