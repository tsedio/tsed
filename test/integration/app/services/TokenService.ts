import {Service} from "@tsed/common";

@Service()
export class TokenService {

    private _token: string = "EMPTY";

    constructor() {
        console.log("create TokenService");

    }

    token(token?: string) {
        if (token) {
            this._token = token;
        }

        return this._token;
    }

    isValid(token: string) {
        return token === "token";
    }
}