export const isSuccessStatus = (code: string | number | undefined) => Number(code) && 200 <= Number(code) && Number(code) < 300;
export const isRedirectionStatus = (code: string | number | undefined) => Number(code) && 300 <= Number(code) && Number(code) < 400;
