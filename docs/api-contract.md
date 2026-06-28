POST /api/upload     → returns { paper_id, text_preview }
POST /api/summarize  → body: { paper_id } → returns { one_line, executive, detailed }
POST /api/score      → body: { paper_id } → returns { scores: {...}, overall: 72 }
POST /api/review     → body: { paper_id } → returns { recommendation, strengths, weaknesses, questions }