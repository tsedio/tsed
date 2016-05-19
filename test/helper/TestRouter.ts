export class TestRouter {

    _get: number = 0;
    _post: boolean;
    _put: boolean;
    _delete: boolean;
    _use: boolean;
    _auth: boolean;
    _param: boolean;
    _head: boolean;

    get(): void {
        this._get++;
    }

    post(): void {
        this._post = true;
    }

    use(): void {
        this._use = true;
    }

    auth(): void {
        this._auth = true;
    }

    put(): void {
        this._put = true;
    }

    delete(): void {
        this._delete = true;
    }

    param(): void {
        this._param = true;
    }

    head(): void {
        this._head = true;
    }
}