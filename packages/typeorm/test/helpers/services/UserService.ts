import {Inject, Injectable} from "@tsed/di/src";
import {UserRepository} from "../repository/UserRepository";

@Injectable()
export class UserService {
  @Inject(UserRepository)
  repo2: UserRepository;

  constructor(public repository: UserRepository) {
  }
}
