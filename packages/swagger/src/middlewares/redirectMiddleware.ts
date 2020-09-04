export function redirectMiddleware(path: string) {
  return (req: any, res: any, next: any) => {
    if (req.url === path && !req.url.match(/\/$/)) {
      res.redirect(`${path}/`);
    } else {
      next();
    }
  };
}
