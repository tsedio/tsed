import {Inject, Service} from "../../../../src";
import {CustomFactory} from "./CustomFactory";
import {SanitizeService} from "./SanitizeService";

@Service()
export class MongooseService {

    private _token: string = "EMPTY";

    constructor(private sanitize: SanitizeService,
                @Inject(CustomFactory) private customFactory: CustomFactory) {

    }

    token(token?: string) {
        if (token) {
            this._token = token;
        }

        return this._token;
    }
}