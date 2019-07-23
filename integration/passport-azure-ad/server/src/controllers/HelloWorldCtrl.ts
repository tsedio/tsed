import {$log, BodyParams, Controller, Get, Head, Post} from "@tsed/common";
import {OAuthBearer} from "../decorators/OAuthBearer";
import {OAuthParams} from "../decorators/OAuthParams";
import {OAuthHead} from "../decorators/OAuthHead";

@Controller("/rest")
export class HelloWorldCtrl {

  @Get("/hello-auth-world")
  @OAuthBearer({"scopes": ["tester"]})
  helloAuthScopesWorld(@OAuthParams("scopes") scopes: string[]) {

    $log.info({event: "helloAuthScopesWorld", scopes});

    return {text: "hello world with scopes"};
  }

  @Get("/hello-auth-world-no-scope")
  @OAuthBearer()
  helloAuthNoScopesWorld(@OAuthParams("scopes") scopes: string[]) {

    $log.info({event: "helloAuthNoScopesWorld", scopes});

    return {text: "hello world auth but no scopes"};
  }

  @Get("/hello-no-auth-world")
  helloNoAuthWorld(@OAuthParams("scopes") scopes: string[]) {

    $log.info({event: "helloNoAuthWorld", scopes});

    return {text: "hello world with no authorisation"};
  }

  @Head("/post-auth-scoped")
  @Post("/post-auth-scoped")
  @OAuthBearer({scopes: ["tester"]})
  postAuthScoped(@OAuthParams("scopes") scopes: string[], @BodyParams() message: any) {

    $log.info({event: "postAuthScoped", scopes});

    return {text: "Auth w Scopes: " + message.text};
  }

  @Head("/post-auth-not-scoped")
  @Post("/post-auth-not-scoped")
  @OAuthBearer()
  postAuthNotScopedHead(@OAuthParams("scopes") scopes: string[], @BodyParams() message: any) {

    $log.info({event: "postAuthNotScopedHead", scopes});

    return {text: "Auth wout Scopes: " + message.text};
  }

  @OAuthHead()
  @Post("/post-no-auth")
  postNoAuth(@OAuthParams("scopes") scopes: string[], @BodyParams() message: any) {

    $log.info({event: "postNoAuth", scopes});

    return {text: "No Auth: " + message.text};
  }
}
