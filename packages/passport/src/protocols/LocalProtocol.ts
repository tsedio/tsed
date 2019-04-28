import {$log, BodyParams, Req} from "@tsed/common";
import {Strategy} from "passport-local";
import {BadRequest} from "ts-httpexceptions";
import {Protocol} from "../decorators/protocol";
import {OnInstall} from "../interfaces/OnInstall";
import {OnVerify} from "../interfaces/OnVerify";

@Protocol({
  name: "local",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class LocalProtocol implements OnVerify, OnInstall {
  $onVerify(@Req() request: Req, @BodyParams() credentials: any): Promise<any> | any {
    const {email} = credentials;

    $log.warn("LocalProtocol shouldn't be used directly from @tsed/passportjs package. Override the LocalProtocol !");

    this.checkEmail(email);

    return credentials;
  }

  $onInstall(strategy: Strategy): void {}

  protected checkEmail(email: string) {
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!(email && regEmail.test(email))) {
      throw new BadRequest("Email is invalid");
    }
  }
}
