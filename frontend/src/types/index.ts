export interface UploadResponse {
  paper_id: string;
  filename: string;
  page_count: number;
  text_preview?: string;
}

export interface SummaryResponse {
  one_line: string;
  executive: string;
  detailed: string;
}

export interface ScoreResponse {
  scores: {
    problem_statement: number;
    literature_review: number;
    methodology: number;
    experiments: number;
    results: number;
    conclusion: number;
    references: number;
  };
  overall: number;
}
