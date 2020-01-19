import {Injectable} from "@tsed/di/src";
import {UserRepository} from "../repository/UserRepository";

@Injectable()
export class UserService {
  constructor(public repository: UserRepository) {
  }
}
