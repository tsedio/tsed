

import {JsonProperty} from '../../../src/decorators/method/json-property';

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