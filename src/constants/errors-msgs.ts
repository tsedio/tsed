

export const DUPLICATED_CONTROLLER_DECORATOR = (name) => `Cannot apply @Controller decorator multiple times (${name}).`;
export const DUPLICATED_SERVICE_DECORATOR = (name) => `Cannot apply @Service decorator multiple times (${name}).`;
export const UNKNOW_CONTROLLER =  (name) => `Controller ${name} not found.`;
export const UNKNOW_SERVICE =  (name) => `Service ${name} not found.`;

export const CYCLIC_REF = (ctrl1, ctrl2) => `Cyclic reference between ${ctrl1} and ${ctrl2}.`;