import {Component, OnInit} from "@angular/core";
import {UserAgentApplication} from "msal";
import {environment} from "../../environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  ngOnInit() {
    console.log(`login component`);
    // necessary - https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/174
    new UserAgentApplication(
      {
        auth: {
          clientId: environment.clientId
        }
      });
  }

}
