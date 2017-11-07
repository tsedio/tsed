import {JsonProperty} from "../../../../../src/jsonschema/decorators/jsonProperty";
import {Required} from "../../../../../src/mvc/decorators";
import {Description} from "../../../../../src/swagger/decorators/description";
import {Title} from "../../../../../src/swagger/decorators/title";

export class SwaNoDecoModel {
    public prop: string;
}

export class SwaBaseModel {
    @Title("id")
    @Description("Unique identifier.")
    @JsonProperty()
    public id?: string;
}

export class SwaNameModel extends SwaBaseModel {
    @Title("name")
    @Description("The name")
    @JsonProperty()
    public name: string;
}

export class SwaAgeModel extends SwaBaseModel {
    @Title("age")
    @Description("The age")
    @JsonProperty()
    public age: number;
}


export class SwaFoo {
    @Title("SwaFoo.test")
    @Description("Description.test")
    test: any;

    @Title("SwaFoo.foo")
    @Description("Description.foo")
    foo: any;

    method() {
    }
}

@Title("SwaFoo2")
@Description("Description Class")
export class SwaFoo2 {

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
    foo: SwaFoo;

    @Title("SwaFoo2.foos")
    @Description("SwaFoo2.foos description")
    @JsonProperty({use: SwaFoo})
    foos: SwaFoo[];

    @Title("SwaFoo2.theMap")
    @Description("SwaFoo2.theMap description")
    @JsonProperty({use: SwaFoo})
    theMap: Map<string, SwaFoo>;

    @Title("SwaFoo2.theSet")
    @Description("SwaFoo2.theSet description")
    @JsonProperty({use: SwaFoo})
    theSet: Set<SwaFoo>;

    @JsonProperty({use: String})
    mapOfString: Map<string, string>;

    @JsonProperty({use: String})
    arrayOfString: string[];

    @JsonProperty()
    nameModel: SwaNameModel;

    @JsonProperty()
    ageModel: SwaAgeModel;

    method() {

    }
}

class SwaFoo3 {
    toJSON() {
        return {};
    }
}

export class Ctrl {

}
