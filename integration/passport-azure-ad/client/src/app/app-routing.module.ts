import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {StartComponent} from "./start/start.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", component: StartComponent},
  {path: "**", component: StartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {enableTracing: false} // <-- debugging purposes only)],
  )],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
