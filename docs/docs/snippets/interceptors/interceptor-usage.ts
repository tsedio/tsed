import {Intercept} from "@tsed/common";
import {MyInterceptor} from "../interceptors/MyInterceptor";

export class MyService {
  // MyInterceptor is going to be used to intercept this method whenever called
  // 'simple data' is static data that will be passed as second arg the the interceptor aroundInvoke
  // this can be any data, you can pass array or object for that matter
  @Intercept(MyInterceptor, "simple data")
  mySimpleMethod() {
    console.log("the simple method is executed");
  }
}
