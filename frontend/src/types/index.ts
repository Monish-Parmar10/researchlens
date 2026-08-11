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

export interface DimensionScore {
  score: number;
  reason: string;
}

export interface ScoreResponse {
  problem_statement: DimensionScore;
  literature_review: DimensionScore;
  methodology: DimensionScore;
  experiments: DimensionScore;
  results: DimensionScore;
  conclusion: DimensionScore;
  references: DimensionScore;
  overall_score: number;
}
