class SearchTextResults {
  image_name: string;
}

export class TextResultsEntity {
  constructor() {}
  readonly search_results?: SearchTextResults;
}

export function createTextResultsEntity(
  init?: Partial<TextResultsEntity>,
): TextResultsEntity {
  return {
    ...init,
  };
}
