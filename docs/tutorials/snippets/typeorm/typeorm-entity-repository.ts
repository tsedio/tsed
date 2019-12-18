import {EntityRepository} from "@tsed/typeorm";
import {Repository} from "typeorm";
import {User} from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

}
