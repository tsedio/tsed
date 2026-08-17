/**
 * Mutable response state used by the portable HTTP pipeline before it is
 * finalized as a standard Fetch {@link Response}.
 */
export class PlatformResponseDraft {
  readonly headers: Headers;
  status: number;
  statusText?: string;

  #body: BodyInit | null = null;
  #finalized = false;

  constructor(init: ResponseInit = {}) {
    this.headers = new Headers(init.headers);
    this.status = init.status || 200;
    this.statusText = init.statusText;
  }

  get body(): BodyInit | null {
    return this.#body;
  }

  get finalized(): boolean {
    return this.#finalized;
  }

  setStatus(status: number, statusText?: string): this {
    this.assertMutable();
    this.status = status;
    this.statusText = statusText;

    return this;
  }

  setHeader(name: string, value: string): this {
    this.assertMutable();
    this.headers.set(name, value);

    return this;
  }

  appendHeader(name: string, value: string): this {
    this.assertMutable();
    this.headers.append(name, value);

    return this;
  }

  removeHeader(name: string): this {
    this.assertMutable();
    this.headers.delete(name);

    return this;
  }

  setBody(body: BodyInit | null): this {
    this.assertMutable();
    this.#body = body;

    return this;
  }

  json(value: unknown): this {
    this.assertMutable();
    this.headers.set("content-type", "application/json; charset=utf-8");
    this.#body = JSON.stringify(value);

    return this;
  }

  finalize(): Response {
    this.assertMutable();
    this.#finalized = true;

    return new Response(this.#body, {
      headers: this.headers,
      status: this.status,
      statusText: this.statusText
    });
  }

  private assertMutable() {
    if (this.#finalized) {
      throw new Error("PlatformResponseDraft has already been finalized");
    }
  }
}
