import type { UploadResponse, SummaryResponse } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


export async function uploadPaper(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file, file.name); //pj's multer field

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function getSummary(paperId: string): Promise<SummaryResponse> {
  const res = await fetch(`${BASE_URL}/api/summary/${paperId}`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}
