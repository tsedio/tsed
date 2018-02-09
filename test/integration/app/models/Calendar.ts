import {JsonProperty, Required} from "@tsed/common";
import {Description, Example, Title} from "@tsed/swagger";

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

