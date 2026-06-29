import Navbar from "@/components/Navbar";
import UploadZone from "@/components/UploadZone";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Understand Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Faster</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload any academic paper and let our AI break it down for you. Get instant summaries, key findings, and interactive Q&A.
          </p>
        </div>

        <UploadZone />
      </main>
    </div>
  );
}
