import {JsonProperty} from "../../../../src";
import {Title} from "../../../../src/swagger/decorators/title";
import {Description} from "../../../../src/swagger/decorators/description";
import {Example} from "../../../../src/swagger/decorators/example";

export class CalendarModel {

    @Title("iD")
    @Description("Description of calendar model id")
    @Example("example1", "Description example")
    @JsonProperty()
    public id: string;

    @JsonProperty()
    public name: string;
}

