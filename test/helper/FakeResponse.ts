export class FakeResponse {
  [key: string]: any;

  statusCode: number = 200;
  _location: string;
  _json: any;
  _body: any = "";
  _headers: string = "";

  constructor(sandbox?: any) {
    if (sandbox) {
      sandbox.stub(this, "send").returns(this);
      sandbox.stub(this, "set").returns(this);
      sandbox.stub(this, "type").returns(this);
      sandbox.stub(this, "redirect").returns(this);
      sandbox.stub(this, "status").returns(this);
      sandbox.stub(this, "location").returns(this);
      sandbox.stub(this, "pipe").returns(this);
      sandbox.stub(this, "on").returns(this);
      sandbox.stub(this, "write").returns(this);
      sandbox.stub(this, "once").returns(this);
      sandbox.stub(this, "emit").returns(this);
      sandbox.stub(this, "json").callsFake((o: any) => {
        this.send(JSON.stringify(o));

        return this;
      });
      sandbox.stub(this, "setHeader").returns(this);
      sandbox.stub(this, "get");
      sandbox.stub(this, "end");
    }
  }

  public set() {
    return this;
  }

  public type() {
    return this;
  }

  public redirect() {
    return this;
  }

  public pipe() {
    return this;
  }

  public on() {
    return this;
  }

  public once() {
    return this;
  }

  public write() {
    return this;
  }

  public emit() {
    return this;
  }

  /**
   *
   * @param value
   * @returns {FakeResponse}
   */
  public status(value: number) {
    this.statusCode = value;

    return this;
  }

  public send(value: any) {
    this._body = "" + value;
  }

  public render(viewPath: string, data: Object) {
    this._body = viewPath + data;
  }

  public location() {
    return this;
  }

  public json(value: any) {
    this._json = value;
    this._body = JSON.stringify(value);

    return this;
  }

  /**
   *
   * @param key
   * @param value
   * @returns {FakeResponse}
   */
  public setHeader(key: string, value: string): FakeResponse {
    this._headers += `${key}:${value}\n`;

    return this;
  }

  public get(key: string) {
    return (this as any)["_" + key];
  }

  end() {
  }
}
