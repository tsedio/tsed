import { EntityRepository } from "@tsed/typeorm";
import { Repository } from "typeorm";
import { Employee } from "./../entities/Employee";

@EntityRepository(Employee)
export default class EmployeeRepository extends Repository<Employee> {}
