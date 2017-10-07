import {JsonProperty} from "../../../../src";
import {Description} from "../../../../src/swagger/decorators/description";
import {Example} from "../../../../src/swagger/decorators/example";
import {Title} from "../../../../src/swagger/decorators/title";
import {Required} from "../../../../src/mvc/decorators";

export class CalendarModel {

    @Title("iD")
    @Description("Description of calendar model id")
    @Example("example1", "Description example")
    @JsonProperty()
    public id: string;

    @JsonProperty()
    @Required()
    public name: string;
}

