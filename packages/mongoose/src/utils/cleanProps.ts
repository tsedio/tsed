export const cleanProps = (src: any) =>
  Object.keys(src).reduce((obj: any, k: any) => {
    if (src[k] !== undefined) {
      obj[k] = src[k];
    }

    return obj;
  }, {});
