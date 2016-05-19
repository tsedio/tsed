
export class FakeRequest {
    method: string;
    path: string;
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
}