import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {Ng4LoadingSpinnerModule} from "ng4-loading-spinner";
import {ToasterModule} from "angular2-toaster";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {AppComponent} from "./app.component";
import {StartComponent} from "./start/start.component";
import {AuthService} from "./services/core/azureAd/AuthService";
import {LoginComponent} from "./login/login.component";
import {HelloWorldService} from "./services/HelloWorldService";
import {HttpClientService} from "./services/core/azureAd/HttpClientService";
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ToasterModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [AuthService, HelloWorldService, HttpClientService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
