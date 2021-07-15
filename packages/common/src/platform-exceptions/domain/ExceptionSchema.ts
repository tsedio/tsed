import * as Exceptions from "@tsed/exceptions";
import {Exception} from "@tsed/exceptions";
import {array, defineStatusModel, from, number, object, string} from "@tsed/schema";

/**
 * @ignore
 */
const ErrorSchema = object({
  name: string().required().description("The error name"),
  message: string().required().description("An error message")
})
  .label("GenericError")
  .unknown();

from(Exception).properties({
  name: string().required().description("The error name"),
  message: string().required().description("An error message"),
  status: number().required().description("The status code of the exception"),
  errors: array().items(ErrorSchema).description("A list of related errors"),
  stack: string().description("The stack trace (only in development mode)")
});

// Auto load models for all Exceptions
Object.values(Exceptions).forEach((target) => {
  if (target !== Exception && target.STATUS) {
    const instance = new target("message");
    from(target).properties({
      name: string().required().example(instance.name).default(instance.name).description("The error name"),
      status: number().required().example(instance.status).default(instance.status).description("The status code of the exception")
    });

    defineStatusModel(target.STATUS, target);
  }
});
