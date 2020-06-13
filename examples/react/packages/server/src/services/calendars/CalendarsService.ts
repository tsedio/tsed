import { Constant, Service, $log } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { TypeORMService } from "@tsed/typeorm";
import { Calendar, CreateCalendar } from "../../models/Calendar";
import { MemoryStorage } from "../storage/MemoryStorage";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import { Employee } from "../../entities/Employee";

@Service()
export class CalendarsService {
  @Constant("calendar.token")
  useToken: boolean;

  constructor(
    private memoryStorage: MemoryStorage,
    private empRepository: EmployeeRepository,
    private typeORMService: TypeORMService
  ) {
    // console.log("EMPLOYEE RESTS = " + empRepository);
    this.memoryStorage.set(
      "calendars",
      require("../../../resources/calendars.json").map((o) => {
        return Object.assign(new Calendar(), o);
      })
    );
  }

  /**
   * Find a calendar by his ID.
   * @param id
   * @returns {undefined|Calendar}
   */
  async find(id: string): Promise<Calendar> {
    const calendars: Calendar[] = await this.query();

    return calendars.find((calendar) => calendar.id === id);
  }

  /**
   * Create a new Calendar
   * @returns {{id: any, name: string}}
   * @param newCalendar
   */
  async create(newCalendar: CreateCalendar): Promise<Calendar> {
    const calendar = new Calendar();
    calendar.id = require("node-uuid").v4();
    calendar.name = newCalendar.name;

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
    console.log(await this.typeORMService.get().manager.count(Employee));
    const noOfEmps: number = await this.empRepository.count({});
    $log.info("TOTAL users = " + noOfEmps);

    return this.memoryStorage.get<Calendar[]>("calendars");
  }

  /**
   *
   * @param updatedCalendar
   * @returns {Calendar}
   */
  async update(updatedCalendar: Partial<Calendar>): Promise<Calendar> {
    const calendars = await this.query();

    const index = calendars.findIndex(
      (value: Calendar) => value.id === updatedCalendar.id
    );

    calendars[index].name = updatedCalendar.name;

    this.memoryStorage.set("calendars", calendars);

    return calendars[index];
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

    this.memoryStorage.set(
      "calendars",
      calendars.filter((calendar) => calendar.id === id)
    );

    return calendar;
  }
}
