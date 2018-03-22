import {Any, JsonProperty, PropertyType, Required} from "@tsed/common";
import {Description, Example, Title} from "@tsed/swagger";

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

    @PropertyType(SwaFoo)
    @Title("SwaFoo2.foos")
    @Description("SwaFoo2.foos description")
    @Example("TODO")
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

    @Any()
    mapAny: Map<string, any>;

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


export class ParentModel {
    @Required()
    parentProperty: string;
}

export class ChildModelA extends ParentModel {
    @Required()
    childPropertyA: string;
}

export class ChildModelB extends ParentModel {
    @Required()
    childPropertyB: string;
}