import {Inject, Scope, Service} from "@tsed/common";
import {MongooseModel} from "../../../../src/mongoose/interfaces";
import {User} from "../models/User";

@Service()
@Scope("request")
export class UserService {

    user: string;

    public constructor(@Inject(User) private userModel: MongooseModel<User>) {
    }

    create(userData: User) {
        const user = new this.userModel(userData);
        const error = user.validateSync();

        if (error) {
            throw error;
        }

        return user;
    }
}