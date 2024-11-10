
import { injectable } from "@tsed/di";
import { Env } from "@tsed/core";

export interface TimeslotsRepository {
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

export const TimeslotsRepository = injectable(Symbol.for("TimeslotsRepository"))
  .class(process.env.NODE_ENV === Env.PROD ? ProdTimeslotsRepository : DevTimeslotsRepository)
  .token();
