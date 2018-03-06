import {Property} from "@tsed/common";
import {Hidden} from "@tsed/swagger";

@Hidden()
export class User {
    @Property()
    name: string;
}