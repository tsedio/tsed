import {Inject, Injectable, IPipe, ParamMetadata} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {PersonModel} from "../models/PersonModel";
import {PersonsService} from "../models/PersonsService";

@Injectable()
export class PersonPipe implements IPipe<string, Promise<PersonModel>> {
  @Inject()
  personsService: PersonsService;

  async transform(id: string, metadata: ParamMetadata): Promise<PersonModel> {
    const person = await this.personsService.findOne(id);

    if (!person) {
      throw new NotFound("Person not found");
    }

    return person;
  }
}
