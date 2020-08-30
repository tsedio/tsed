import {CollectionOf, Ignore, MinLength, Name, Property, Required} from "@tsed/common";

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

  method() {}

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
      foo: this.foo,
    };
  }
}

export class JsonFoo1 {
  @Property()
  test: string;
}

export class JsonFoo2 {
  @Property()
  @Required()
  @MinLength(3)
  test: string;

  @Property()
  @Name("Name")
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

  @CollectionOf(JsonFoo)
  foos: JsonFoo[];

  @CollectionOf(JsonFoo1)
  foos2: JsonFoo1[];

  @CollectionOf(JsonFoo1)
  theMap: Map<string, JsonFoo1>;

  @CollectionOf(JsonFoo1)
  theSet: Set<JsonFoo1>;

  @CollectionOf(String)
  mapOfString: Map<string, string>;

  @CollectionOf(String)
  arrayOfString: string[];

  @Property()
  nameModel: JsonNameModel;

  @Property()
  ageModel: JsonAgeModel;

  @Ignore()
  password: string;

  method() {}
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

export class Circular {
  @Property()
  parent: Circular;
}

export class Dependency {
  @Property()
  dep: any;
}

export class IndirectCircular {
  @Property()
  parent: Dependency;
}

CollectionOf(IndirectCircular)(Dependency, "dep");
