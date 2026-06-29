"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, AlertCircle } from "lucide-react";
import { uploadPaper } from "@/lib/api";
import LoadingSpinner from "./LoadingSpinner";

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return false;
    }
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
      setError("File size must be less than 10MB.");
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const result = await uploadPaper(file);
      router.push(`/results/${result.paper_id}`);
    } catch (err) {
      setError("Failed to analyze paper. Please try again.");
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ease-in-out cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${file ? 'bg-gray-50 border-gray-300' : 'bg-white'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="application/pdf"
          onChange={handleFileSelect}
        />

        {!file ? (
          <div className="space-y-4 pointer-events-none">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Upload your research paper</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Drag and drop your PDF here, or click to browse. Max file size: 10MB.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4 bg-white p-4 rounded-lg border shadow-sm inline-flex">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="text-left">
                <p className="font-medium text-gray-800 truncate max-w-[200px]" title={file.name}>
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="ml-4 text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
            
            <div>
              <button
                onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-transform transform hover:-translate-y-0.5"
              >
                Analyze Paper
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-center text-red-600 bg-red-50 py-2 px-4 rounded-lg">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}
