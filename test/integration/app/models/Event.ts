import {JsonProperty} from "../../../../src";

export class Task {
    public name: string = void 0;
    public percent: number;
}

export class EventModel {

    @JsonProperty()
    public startDate: Date;

    @JsonProperty()
    public endDate: Date;

    @JsonProperty("Name")
    public name: string;

    @JsonProperty({use: Task})
    public tasks: Task[];

}

