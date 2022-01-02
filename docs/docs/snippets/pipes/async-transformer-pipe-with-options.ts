import {Inject, Injectable} from "@tsed/di";
import {NotFound} from "@tsed/exceptions";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {IUsePersonParamOptions} from "../decorators/UsePersonParam";
import {PersonModel} from "../models/PersonModel";
import {PersonsService} from "../models/PersonsService";

@Injectable()
export class PersonPipe implements PipeMethods<string, Promise<PersonModel>> {
  @Inject()
  personsService: PersonsService;

  async transform(id: string, metadata: JsonParameterStore): Promise<PersonModel> {
    const person = await this.personsService.findOne(id);
    const options = metadata.store.get<IUsePersonParamOptions>(PersonPipe);

    if (!person && options.optional) {
      throw new NotFound("Person not found");
    }

    return person;
  }
}
