import {Inject, Injectable} from "@tsed/di";
import {UserRepository} from "./repository/UserRepository";

@Injectable()
export class OtherService {
  constructor(userRepository: UserRepository) {

  }
}
