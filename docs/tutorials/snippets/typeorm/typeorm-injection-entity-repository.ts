import {Inject, Injectable} from "@tsed/di";
import {UseConnection} from "@tsed/typeorm";

import {UserRepository} from "./repository/UserRepository";

@Injectable()
export class OtherService {
  @Inject()
  @UseConnection("db2")
  userRepository2: UserRepository;

  constructor(
    public userRepository: UserRepository,
    @UseConnection("db3") public userRepository3: UserRepository
  ) {}
}
