import {Constant, Service} from "@tsed/common";
import {NotFound} from "ts-httpexceptions";
import {$log} from "ts-log-debug";
import {Calendar} from "../../interfaces/Calendar";
import {MemoryStorage} from "../storage/MemoryStorage";

@Service()
export class CalendarsService {

  @Constant("calendar.token")
  useToken: boolean;

  constructor(private memoryStorage: MemoryStorage) {
    this.memoryStorage.set("calendars", require("../../../resources/calendars.json"));
  }

  $onInit() {
    $log.info("===useToken", this.useToken);
  }

  /**
   * Find a calendar by his ID.
   * @param id
   * @returns {undefined|Calendar}
   */
  async find(id: string): Promise<Calendar> {
    const calendars: Calendar[] = await this.query();
    return calendars.find(calendar => calendar.id === id);
  }

  /**
   * Create a new Calendar
   * @param name
   * @returns {{id: any, name: string}}
   */
  async create(name: string) {
    const calendar = {id: require("node-uuid").v4(), name: name};
    const calendars = this.memoryStorage.get<Calendar[]>("calendars");

    calendars.push(calendar);

    this.memoryStorage.set("calendars", calendars);

    return calendar;
  }

  /**
   *
   * @returns {Calendar[]}
   */
  async query(): Promise<Calendar[]> {
    return this.memoryStorage.get<Calendar[]>("calendars");
  }

  /**
   *
   * @param calendar
   * @returns {Calendar}
   */
  async update(calendar: Calendar): Promise<Calendar> {

    const calendars = await this.query();

    const index = calendars.findIndex((value: Calendar) => value.id === calendar.id);

    calendars[index] = calendar;

    this.memoryStorage.set("calendars", calendars);

    return calendar;
  }

  /**
   *
   * @param id
   * @returns {Promise<Calendar>}
   */
  async remove(id: string): Promise<Calendar> {

    const calendar = await this.find(id);

    if (!calendar) {
      throw new NotFound("Calendar not found");
    }

    const calendars = await this.query();

    this.memoryStorage.set("calendars", calendars.filter(calendar => calendar.id === id));

    return calendar;
  }
}