import {Inject, Injectable} from "@tsed/di";

import {CONNECTION} from "./typeorm-async-provider";

@Injectable()
export class UserService {
  constructor(@Inject(CONNECTION) connection: CONNECTION) {}
}
