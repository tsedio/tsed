
let result: any;

export const FakeNextFn: any = (e) => {
    result = e;
};

FakeNextFn.get = () => {
    return result;
};

FakeNextFn.reset = () => {
    result = undefined;
};
