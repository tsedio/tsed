type ColorTextFn = (text: string) => string;

// istanbul ignore next
const colorIfAllowed = (colorFn: ColorTextFn) => (text: string) => (!process.env.NO_COLOR ? colorFn(text) : text);

const red = colorIfAllowed((text: string) => `\x1B[31m${text}\x1B[39m`);
const yellow = colorIfAllowed((text: string) => `\x1B[33m${text}\x1B[39m`);
const green = colorIfAllowed((text: string) => `\x1B[32m${text}\x1B[39m`);

export const colors = {red, yellow, green};
