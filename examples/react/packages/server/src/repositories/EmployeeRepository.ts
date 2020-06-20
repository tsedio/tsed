import { Repository, EntityRepository } from "typeorm";
import { Employee } from "./../entities/Employee";

@EntityRepository(Employee)
export default class EmployeeRepository extends Repository<Employee> {}
