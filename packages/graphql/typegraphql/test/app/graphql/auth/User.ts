import {Email, Name, Property} from "@tsed/schema";
import {Field, ID, ObjectType} from "type-graphql";

@ObjectType({description: "User account"})
export class User {
  @Name("id")
  _id: string;

  @Email()
  @Field()
  email: string;

  @Property()
  @Field()
  password: string;

  @Property()
  @Name("email_verified")
  @Field()
  emailVerified: boolean;

  @Field((type) => ID)
  get id() {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  constructor(options: Partial<User> = {}) {
    options._id && (this._id = options._id);
    options.email && (this.email = options.email);
    options.password && (this.password = options.password);
    options.emailVerified && (this.emailVerified = options.emailVerified);
  }
}
