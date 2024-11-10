import {Injectable} from "@tsed/di";

export interface Bar {
  type: string;
}

export const Bar: unique symbol = Symbol("Bar");

@Injectable({type: Bar})
class Foo implements Bar {
  private readonly name = "foo";
}

@Injectable({type: Bar})
class Baz implements Bar {
  private readonly name = "baz";
}
