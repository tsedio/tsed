import {SanitizeService} from "./SanitizeService";
import {CustomFactory} from "./CustomFactory";
import {Inject, Service} from "../../../../src";

@Service()
export class MongooseService {

    private _token: string = "EMPTY";

    constructor(private sanitize: SanitizeService,
                @Inject(CustomFactory) private customFactory: CustomFactory) {

    }

    token(token?) {
        if (token) {
            this._token = token;
        }

        return this._token;
    }
}