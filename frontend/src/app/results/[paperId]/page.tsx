import Navbar from "@/components/Navbar";
import ResultsDashboard from "@/components/ResultsDashboard";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = await params;
  
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <ResultsDashboard paperId={paperId} />
    </div>
  );
}
