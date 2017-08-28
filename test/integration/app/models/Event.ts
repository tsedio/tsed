import {JsonProperty} from "../../../../src";
import {Description} from "../../../../src/swagger/decorators/description";
import {Example} from "../../../../src/swagger/decorators/example";
import {Title} from "../../../../src/swagger/decorators/title";

export class Task {
    @JsonProperty()
    public name: string = "";

    @JsonProperty()
    public percent: number;
}

export class EventModel {

    @Title("iD")
    @Description("Description of event model id")
    @Example("example1", "Description example")
    @JsonProperty()
    public id: string;

    @JsonProperty()
    public startDate: Date;

    @JsonProperty()
    public endDate: Date;

    @JsonProperty("Name")
    public name: string;

    @JsonProperty({use: Task})
    public tasks: Task[];

}

