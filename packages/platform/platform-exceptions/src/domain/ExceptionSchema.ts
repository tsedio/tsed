import * as Exceptions from "@tsed/exceptions";
import {Exception} from "@tsed/exceptions";
import {defineStatusModel, getStatusConstant, s} from "@tsed/schema";

/**
 * @ignore
 */
const ErrorSchema = s
  .object({
    name: s.string().required().description("The error name"),
    message: s.string().required().description("An error message")
  })
  .label("GenericError")
  .unknown();

s.get(Exception).properties({
  name: s.string().required().description("The error name"),
  message: s.string().required().description("An error message"),
  status: s.number().required().description("The status code of the exception"),
  errors: s.array().items(ErrorSchema).description("A list of related errors"),
  stack: s.string().description("The stack trace (only in development mode)")
});

// Auto load models for all Exceptions
Object.values(Exceptions).forEach((target: any) => {
  if (target !== Exception && target.STATUS) {
    if (target.STATUS > 302) {
      const name = getStatusConstant(target.STATUS);
      s.get(target).properties({
        name: s.string().required().example(name).default(name).description("The error name"),
        status: s.number().required().example(target.STATUS).default(target.STATUS).description("The status code of the exception")
      });

      defineStatusModel(target.STATUS, target);
    }
  }
});
