export class FakeRequest {
    method: string;
    path: string;
    mime: string;
    id: number;
    tagId: string;
    _responseData: any;
    public accepts = (mime: string) => this.mime === mime;

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
        return {
            store: {
                get: () => {
                }
            }
        };
    }

    public end() {

    }
}