import {Constant, Module, OnDestroy, OnInit} from "@tsed/common";
import {ConnectionOptions} from "typeorm";
import {TypeORMService} from "./services/TypeORMService";

@Module()
export class TypeORMModule implements OnInit, OnDestroy {
  @Constant("typeorm", {})
  private settings: {[key: string]: ConnectionOptions};

  constructor(private typeORMService: TypeORMService) {}

  $onInit(): Promise<any> | void {
    const promises = Object.keys(this.settings).map(key => this.typeORMService.createConnection(key, this.settings[key]));

    return Promise.all(promises);
  }

  $onDestroy(): Promise<any> | void {
    return this.typeORMService.closeConnections();
  }
}
