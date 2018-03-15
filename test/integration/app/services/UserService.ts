import {Scope, Service} from "@tsed/common";

@Service()
@Scope("request")
export class UserService {

    user: string;

    public constructor() {
    }

}