export async function listAll<Item>(enabled: unknown, list: (params: {cursor?: string}) => Promise<any>, key: string): Promise<Item[]> {
  const items: Item[] = [];
  let cursor: string | undefined;

  if (!enabled) {
    return items;
  }

  do {
    const page = await list(cursor ? {cursor} : {});

    items.push(...page[key]);
    cursor = page.nextCursor;
  } while (cursor);

  return items;
}
