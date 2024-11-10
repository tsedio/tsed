import {injectable} from "@tsed/di";

export interface Bar {
  type: string;
}

export const Bar: unique symbol = Symbol("Bar");

class Foo implements Bar {
  private readonly name = "foo";
}

class Baz implements Bar {
  private readonly type = "baz";
}


injectable(Foo).type(Bar);
injectable(Baz).type(Bar);
