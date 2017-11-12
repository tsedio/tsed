export class FakeRequest {
    method: string;
    path: string;
    mime: string;
    id: number;
    tagId: string;
    _responseData: any;
    _endpoint: any;
    public accepts = (mime: string) => this.mime === mime;

    public log: Express.RequestLogger = {
        debug: (scope?: any) => {
        },

        info: (scope?: any) => {
        },

        trace: (scope?: any) => {
        },

        warn: (scope?: any) => {
        },

        error: (scope?: any) => {
        }
    };

    /**
     *
     * @type {{test: string, obj: {test: string}}}
     */
    public cookies: any = {
        test: "testValue",
        obj: {
            test: "testValue"
        }
    };
    /**
     *
     * @type {{test: string, obj: {test: string}}}
     */
    public body: any = {
        test: "testValue",
        obj: {
            test: "testValue"
        }
    };
    /**
     *
     * @type {{test: string, obj: {test: string}}}
     */
    public query: any = {
        test: "testValue",
        obj: {
            test: "testValue"
        }
    };
    /**
     *
     * @type {{test: string, obj: {test: string}}}
     */
    public params: any = {
        test: "testValue",
        obj: {
            test: "testValue"
        }
    };

    public session: any = {
        test: "testValue",
        obj: {
            test: "testValue"
        }
    };

    public get(expression: any) {
        return "headerValue";
    }

    public getStoredData() {
        return this._responseData || {};
    }

    public storeData(data: any) {
        this._responseData = data;
        return this;
    }

    public getEndpoint() {
        return this._endpoint || {
            store: {
                get: () => {
                }
            }
        };
    }

    public setEndpoint(endpoint: any) {
        this._endpoint = endpoint;
    }

    public end() {

    }
}