import {Model, Ref, DynamicRef} from "@tsed/mongoose";
import {Enum, Required} from "@tsed/common"

@Model()
export class DynamicRef {
    @DynamicRef('type')
    dynamicRef: Ref<ModelA | ModelB>

    @Enum(['Mode lA', 'ModelB']) 
    type: string // This field has to match the referenced model's name
}