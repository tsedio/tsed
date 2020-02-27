import {Any, Property, PropertyType, Required} from "@tsed/common";
import {Description, Example, Title} from "../../../src";

export class SwaNoDecoModel {
  public prop: string;
}

export class SwaBaseModel {
  @Title("id")
  @Description("Unique identifier.")
  @Property()
  public id?: string;
}

export class SwaNameModel extends SwaBaseModel {
  @Title("name")
  @Description("The name")
  @Property()
  public name: string;
}

export class SwaAgeModel extends SwaBaseModel {
  @Title("age")
  @Description("The age")
  @Property()
  public age: number;
}

export class SwaFoo {
  @Title("SwaFoo.test")
  @Description("Description.test")
  test: any;

  @Title("SwaFoo.foo")
  @Description("Description.foo")
  foo: any;

  method() {}
}

@Title("SwaFoo2")
@Description("Description Class")
export class SwaFoo2 {
  @Title("Test")
  @Description("Description test")
  @Property()
  @Required()
  test: string = "";

  @Property("Name")
  name: string;

  @Property()
  dateStart: Date;

  @Property()
  uint: number;

  object: any;

  @Property()
  foo: SwaFoo;

  @PropertyType(SwaFoo)
  @Title("SwaFoo2.foos")
  @Description("SwaFoo2.foos description")
  @Example("TODO")
  foos: SwaFoo[];

  @Title("SwaFoo2.theMap")
  @Description("SwaFoo2.theMap description")
  @PropertyType(SwaFoo)
  theMap: Map<string, SwaFoo>;

  @Title("SwaFoo2.theSet")
  @Description("SwaFoo2.theSet description")
  @Property({use: SwaFoo})
  theSet: Set<SwaFoo>;

  @Property({use: String})
  mapOfString: Map<string, string>;

  @Property({use: String})
  arrayOfString: string[];

  @Property()
  nameModel: SwaNameModel;

  @Property()
  ageModel: SwaAgeModel;

  @Any()
  mapAny: Map<string, any>;
  @Any()
  anyValue: any;

  method() {}
}

export class Ctrl {}

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
