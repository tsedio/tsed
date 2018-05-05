import {Allow, Email, MinLength, Property, Required} from "@tsed/common";
import {Hidden} from "@tsed/swagger";
import {Indexed, Model, Unique} from "../../../../src/mongoose/decorators";

@Hidden()
@Model()
export class User {
    @Property()
    name: string;

    @Indexed()
    @Required()
    @Email()
    @Unique()
    @Allow(null)
    email: string;

    @Required()
    @MinLength(6)
    @Allow(null)
    password: string;
}
