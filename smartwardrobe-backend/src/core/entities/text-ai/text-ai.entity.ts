class SearchTextResults {
  image_name: string;
}
class ExpandedQueries {
  query1: string;
  query2: string;
  query3: string;
}
export class TextResultsEntity {
  constructor() {}
  readonly expanded_queries?: ExpandedQueries;
  readonly search_results?: SearchTextResults;
}

export function createTextResultsEntity(
  init?: Partial<TextResultsEntity>,
): TextResultsEntity {
  return {
    ...init,
  };
}
