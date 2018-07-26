import {Constant, OnInit, Service} from "@tsed/common";
import {ConnectionOptions} from "typeorm";
import {TypeORMService} from "./services/TypeORMService";

@Service()
export class TypeORMModule implements OnInit {
  @Constant("typeorm", {})
  private settings: {[key: string]: ConnectionOptions};

  constructor(private typeORMService: TypeORMService) {}

  $onInit(): Promise<any> | void {
    const promises = Object.keys(this.settings).map(key => this.typeORMService.createConnection(key, this.settings[key]));

    return Promise.all(promises);
  }
}
