import {Injectable} from "@angular/core";
import {ToasterService} from "angular2-toaster";
import {HttpClientService} from "./core/azureAd/HttpClientService";

const SERVER_URL = "/rest";
const HELLO_AUTH = "/hello-auth-world";
const HELLO_AUTH_NO_SCOPE = "/hello-auth-world-no-scope";
const HELLO_NO_AUTH = "/hello-no-auth-world";
const POST_AUTH_SCOPED = "/post-auth-scoped";
const POST_AUTH_NOT_SCOPED = "/post-auth-not-scoped";
const POST_NO_AUTH = "/post-no-auth";

@Injectable()
export class HelloWorldService {

  // constructor(private http: HttpClient, private authService: AuthService, private toast: ToasterService) {
  constructor(private httpClientService: HttpClientService, private toast: ToasterService) {
    httpClientService.setServer(SERVER_URL);
  }

  async helloAuthWorld(): Promise<any> {
    const response = await this.get(HELLO_AUTH);

    console.log(`helloAuthWorld: ${JSON.stringify(response)}`);

    return response;
  }

  async helloAuthWorldNoScope(): Promise<any> {
    const response = await this.get(HELLO_AUTH_NO_SCOPE);

    console.log(`helloAuthWorldNoScope: ${JSON.stringify(response)}`);

    return response;
  }

  async helloNoAuthWorld(): Promise<any> {
    const response = await this.get(HELLO_NO_AUTH);

    console.log(`helloNoAuthWorld: ${JSON.stringify(response)}`);

    return response;
  }

  async postAuthCallScoped(message: any): Promise<any> {
    const response = await this.post(POST_AUTH_SCOPED, message);

    console.log(`postAuthCallScoped: ${JSON.stringify(response)}`);

    return response;
  }

  async postAuthCallNoScope(message: any): Promise<any> {
    const response = await this.post(POST_AUTH_NOT_SCOPED, message);

    console.log(`postAuthCallNoScope: ${JSON.stringify(response)}`);

    return response;
  }

  async postNoAuthCall(message: any): Promise<any> {
    const response = await this.post(POST_NO_AUTH, message);

    console.log(`postNoAuthCall: ${JSON.stringify(response)}`);

    return response;
  }

  private async post(endpoint: string, payload: any) {
    try {
      return this.httpClientService
        .post(SERVER_URL + endpoint, payload, {scopesApplied: true})
        .toPromise();
    } catch (error) {
      this.handleError(error, "helloWorld");
      throw error;
    }
  }

  private async get(endpoint: string, where: string = "helloWorld") {
    try {
      return this.httpClientService
        .post(SERVER_URL + endpoint, {scopesApplied: true})
        .toPromise();
    } catch (error) {
      this.handleError(error, where);
      throw error;
    }
  }

  private handleError(error: any, where: any): any {
    let msg;
    if (error.status === 403) {
      msg = `Unauthorized: ${JSON.stringify(error)}`;
    } else {
      msg = JSON.stringify(error);
    }
    console.error(msg);
    this.toast.pop("error", where, msg);
  }
}
