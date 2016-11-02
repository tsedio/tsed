
import {Service} from '../../index';
import {SanitizeService} from "./SanitizeService";

@Service()
export class MongooseService{

    private _token: string = "EMPTY";

    constructor(
        private sanitize: SanitizeService
    ) {
        console.log('Service Mongoose', sanitize);
    }

    token(token?) {
        if(token) {
            this._token = token;
        }

        return this._token;
    }
}