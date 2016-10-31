export const DUPLICATED_CONTROLLER_DECORATOR = (name) => `Cannot apply @Controller decorator multiple times (${name}).`;
export const UNKNOW_CONTROLLER =  (name) => `Controller ${name} not found.`;
//export const UNABLE_TO_INSTANCIATE_CTRL = (name) => `Unable to instanciate controller ${name}.`;
export const CYCLIC_REF = (ctrl1, ctrl2) => `Cyclic reference between ${ctrl1} and ${ctrl2}.`;