import type { UploadResponse, SummaryResponse } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Temporary mock in api.ts
export async function uploadPaper(file: File): Promise<UploadResponse> {
  // fake loading for 2 seconds
  await new Promise(r => setTimeout(r, 2000)); 
  return { paper_id: "mock-123", filename: file.name, page_count: 8 };
}

export async function getSummary(paperId: string): Promise<SummaryResponse> {
  const res = await fetch(`${BASE_URL}/api/summary/${paperId}`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}
