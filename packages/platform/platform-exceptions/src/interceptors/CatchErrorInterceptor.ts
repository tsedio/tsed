import {Type} from "@tsed/core";
import {
  DIContext,
  Inject,
  Injectable,
  InjectContext,
  InjectorService,
  InterceptorContext,
  InterceptorMethods,
  InterceptorNext
} from "@tsed/di";
import {CatchErrorMethods} from "../interfaces/CatchErrorMethods";

@Injectable()
export class CatchErrorInterceptor implements InterceptorMethods {
  @Inject()
  protected injector: InjectorService;

  @InjectContext()
  protected $ctx: DIContext;

  async intercept(
    context: InterceptorContext<
      Type<any>,
      {
        catcher: Type<CatchErrorMethods>;
      }
    >,
    next: InterceptorNext
  ) {
    try {
      return await next();
    } catch (error) {
      const catcher = this.injector.get<CatchErrorMethods>(context.options!.catcher)!;

      return await catcher.catch(error, this.$ctx);
    } finally {
      const catcher = this.injector.get<CatchErrorMethods>(context.options!.catcher)!;

      if (catcher.finally) {
        catcher.finally(this.$ctx);
      }
    }
  }
}
