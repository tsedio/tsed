import {Inject, Injectable} from "@tsed/di";
import {UseConnection} from "../../../src/index.js";
import {UserRepository} from "../repository/UserRepository.js";

@Injectable()
export class UserService {
  @Inject()
  repo2: UserRepository;

  @Inject()
  @UseConnection("db2")
  repo3: UserRepository;

  constructor(
    @UseConnection("db2") public repo4: UserRepository,
    public repo1: UserRepository
  ) {}
}
