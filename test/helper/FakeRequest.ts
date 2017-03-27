export class FakeRequest {
    method: string;
    path: string;
    mime: string;
    id: number;
    tagId: string;
    _responseData;

    public get(expression) {
        return "headerValue";
    }

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

    public storeData(data) {
        this._responseData = data;
        return this;
    }

    public getStoredData() {
        return this._responseData || {};
    }

    public accepts = (mime) => this.mime === mime;

    public getEndpoint() {
        return {};
    }
}