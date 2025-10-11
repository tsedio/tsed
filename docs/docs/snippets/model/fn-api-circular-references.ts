import {s} from "@tsed/schema";

export const Photo = s.object({
  owner: s.lazyRef(() => User)
});

export const User = s.object({
  photos: s.array().items(Photo)
});
