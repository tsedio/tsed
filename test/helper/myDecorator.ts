export function myDecorator(type) {

    //class
    function decorator(target: Function): void;
    //method
    function decorator(target: Object, targetKey: string | symbol): void;
    //static
    function decorator(target: Object, targetKey?: string | symbol): void {
        console.log("type =>", type, "target =>", target.prototype ? target : target.constructor, "targetKey =>", targetKey);
    }

    return decorator;
}