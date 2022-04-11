import {RecordOf} from "@tsed/schema";

type keys = "tech" | "hr";

class Department {
  employeeSize: number;
}

type Departments = Record<keys, Department>;

class Company {
  @RecordOf(Department, "tech", "hr")
  departments: Departments;
}
