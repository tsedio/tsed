import {JsonProperty} from "../../../../src";
import {Required} from "../../../../src/mvc/decorators";
import {Description} from "../../../../src/swagger/decorators/description";
import {Example} from "../../../../src/swagger/decorators/example";
import {Title} from "../../../../src/swagger/decorators/title";

export class Task {
    @JsonProperty()
    public name: string = "";

    @JsonProperty()
    public percent: number;
}

@Title("EventModel Title")
export class EventModel {

    @Title("iD")
    @Description("Description of event model id")
    @Example("example1", "Description example")
    @JsonProperty()
    public id: string;

    @JsonProperty()
    @Required()
    public startDate: Date;

    @JsonProperty()
    @Required()
    public endDate: Date;

    @JsonProperty("Name")
    @Required()
    public name: string;

    @JsonProperty({use: Task})
    public tasks: Task[];

}

