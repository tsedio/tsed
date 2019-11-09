import {Task} from "./Task";

export interface Event {
  id: string;
  calendarId: string;
  startDate: string;
  endDate: string;
  name: string;
  tasks?: Task[];
}
