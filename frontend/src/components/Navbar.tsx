import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <BookOpen className="w-7 h-7" />
            <span className="font-bold text-xl tracking-tight text-gray-900">ResearchLens</span>
          </Link>
          <div className="flex space-x-4">
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Documentation</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
