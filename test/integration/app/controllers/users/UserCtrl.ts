import {Controller, Get, PathParams, ProviderScope, Scope} from "@tsed/common";
import {Hidden} from "../../../../../src/swagger";
import {UserService} from "../../services/UserService";

@Controller("/user")
@Scope(ProviderScope.REQUEST)
@Hidden()
export class UserCtrl {

    userId: string;

    constructor(public userService: UserService) {
    }

    @Get("/:user")
    async testPerRequest(@PathParams("user") userId: string): Promise<any> {

        this.userService.user = userId;
        this.userId = userId;

        return new Promise((resolve, reject) => {

            if (userId === "0") {
                setTimeout(() => {
                    resolve({userId, idSrv: this.userService.user, idCtrl: this.userId});
                }, 500);
            }

            if (userId === "1") {
                setTimeout(() => {
                    resolve({userId, idSrv: this.userService.user, idCtrl: this.userId});
                }, 300);
            }

            if (userId === "2") {
                setTimeout(() => {
                    resolve({userId, idSrv: this.userService.user, idCtrl: this.userId});
                }, 150);
            }

        });
    }
}