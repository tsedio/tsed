import {Service} from "@tsed/common";

@Service()
export class TokenService {

    private _token: string = "EMPTY";

    token(token?: string) {
        if (token) {
            this._token = token;
        }

        return this._token;
    }
}