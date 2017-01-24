
export function waiter(method, ...args: any[]){

    return Promise
        .resolve()
        .then(() => {
            const result = method(...args);

            if (result && result.then) {
                return result.then;
            }

            return result;
        });

}