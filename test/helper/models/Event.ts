import {JsonProperty} from '../../../src/decorators/json-property';
import {Model} from "../../../src/models/model";
import {Table, Column} from "../../../src/decorators/model";

export class EventModel {

    @JsonProperty()
    public startDate: Date;

    @JsonProperty()
    public endDate: Date;

    @JsonProperty('Name')
    public name: string;

    @JsonProperty({use: Task})
    public tasks: Task[];

}

export class Task {
    public name: string = void 0;
    public percent: number;
}

@Table("comments")
export class Comment extends Model {

    @Column()
    private id: number;

    @Column("_content")
    private content: string;

    private otherThing: number;
}