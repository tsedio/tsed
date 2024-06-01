import {EntityRepository, Repository} from "typeorm";
import {User} from "../entity/User.js";

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
