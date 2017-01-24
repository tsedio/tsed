
export function waiter(method, ...args: any[]){

    return Promise.resolve().then(() => method(...args));

}