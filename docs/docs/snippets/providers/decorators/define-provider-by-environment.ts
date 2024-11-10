import {Configuration} from "@tsed/di";

const TimeslotsRepository = Symbol.for("TimeslotsRepository");

interface TimeslotsRepository {
  findTimeslots(): Promise<any[]>;
}

class DevTimeslotsRepository implements TimeslotsRepository {
  findTimeslots(): Promise<any[]> {
    return ["hello dev"];
  }
}

class ProdTimeslotsRepository implements TimeslotsRepository {
  findTimeslots(): Promise<any[]> {
    return ["hello prod"];
  }
}

@Configuration({
  imports: [
    {
      token: TimeslotsRepository,
      useClass: process.env.NODE_ENV === "production" ? ProdTimeslotsRepository : DevTimeslotsRepository
    }
  ]
})
export class Server {}
