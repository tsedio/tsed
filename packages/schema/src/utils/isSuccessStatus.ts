export const isSuccessStatus = (code: string | number | undefined) => !!(Number(code) && 200 <= Number(code) && Number(code) < 300);
