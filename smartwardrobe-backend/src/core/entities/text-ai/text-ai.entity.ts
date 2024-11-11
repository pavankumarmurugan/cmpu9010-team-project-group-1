class SearchTextResults {
  image_name: string;
}
export class SearchTextQueryResults {
  query: string;
}

export class TextResultsEntity {
  constructor() {}
  readonly expanded_queries: SearchTextQueryResults[] = [];
  readonly search_results: SearchTextResults[] = [];
}

export function createTextResultsEntity(
  init?: Partial<TextResultsEntity>,
): TextResultsEntity {
  const entity = new TextResultsEntity();
  if (init) {
    Object.assign(entity, init);
  }
  return entity;
}
