import {Intercept, Injectable} from "@tsed/di";
import {MyInterceptor} from "../interceptors/MyInterceptor";

@Injectable()
export class MyService {
  // MyInterceptor is going to be used to intercept this method whenever called
  // 'simple data' is static data that will be passed as second arg to the interceptor.intercept method
  @Intercept(MyInterceptor, "simple data")
  mySimpleMethod() {
    console.log("the simple method is executed");
  }
}

// on class
@Injectable()
@Intercept(MyInterceptor, "simple data")
export class MyService2 {
  mySimpleMethod1() {
    console.log("the simple method is executed");
  }

  mySimpleMethod2() {
    console.log("the simple method is executed");
  }
}
