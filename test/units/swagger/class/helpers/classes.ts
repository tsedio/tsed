
import {Title} from "../../../../../src/swagger/decorators/title";
import {Description} from "../../../../../src/swagger/decorators/description";
import {Required} from "../../../../../src/mvc/decorators";
import {JsonProperty} from "../../../../../src/converters/decorators/jsonProperty";


export class BaseModel {
    @Title("id")
    @Description("Unique identifier.")
    @JsonProperty()
    public id?: string;
}

export class NameModel extends BaseModel {
    @Title("name")
    @Description("The name")
    @JsonProperty()
    public name: string;
}

export class AgeModel extends BaseModel {
    @Title("age")
    @Description("The age")
    @JsonProperty()
    public age: number;
}


export class Foo {
    @Title("Foo.test")
    @Description("Description.test")
    test: any;

    @Title("Foo.foo")
    @Description("Description.foo")
    foo: any;

    method() {
    }
}

@Title("Foo2")
@Description("Description Class")
export class Foo2 {

    @Title("Test")
    @Description("Description test")
    @JsonProperty()
    @Required()
    test: string = "";

    @JsonProperty("Name")
    name: string;

    @JsonProperty()
    dateStart: Date;

    @JsonProperty()
    uint: number;

    object: any;

    @JsonProperty()
    foo: Foo;

    @Title("Foo2.foos")
    @Description("Foo2.foos description")
    @JsonProperty({use: Foo})
    foos: Foo[];

    @Title("Foo2.theMap")
    @Description("Foo2.theMap description")
    @JsonProperty({use: Foo})
    theMap: Map<string, Foo>;

    @Title("Foo2.theSet")
    @Description("Foo2.theSet description")
    @JsonProperty({use: Foo})
    theSet: Set<Foo>;

    @JsonProperty({use: String})
    mapOfString: Map<string, string>;

    @JsonProperty({use: String})
    arrayOfString: string[];

    @JsonProperty()
    nameModel: NameModel;

    @JsonProperty()
    ageModel: AgeModel;

    method() {

    }
}

class Foo3 {
    toJSON() {
        return {};
    }
}

export class Ctrl {

}
