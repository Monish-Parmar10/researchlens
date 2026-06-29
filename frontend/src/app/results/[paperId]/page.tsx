import Link from "next/link";

export default async function ResultsPage({ 
  params 
}: { 
  params: Promise<{ paperId: string }> 
}) {
  const { paperId } = await params;
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Analyzing paper...</h1>
      <p className="text-muted-foreground text-sm">
        Paper ID: {paperId}
      </p>
      <p className="text-sm text-gray-400">
        Summary will appear here once AI service is ready.
      </p>
      <Link href="/" className="mt-4 px-4 py-2 border rounded hover:bg-gray-50 text-sm">
        &larr; Back
      </Link>
    </main>
  );
}
