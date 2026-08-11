"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle, MessageSquare, BarChart2 } from "lucide-react";
import type { SummaryResponse, ScoreResponse } from "@/types";
import { getSummary } from "@/lib/api";

const mockScores: ScoreResponse = {
  scores: {
    problem_statement: 85,
    literature_review: 70,
    methodology: 90,
    experiments: 75,
    results: 88,
    conclusion: 72,
    references: 65
  },
  overall: 78
};

const TABS = ["Summary", "Quality Score", "Reviewer Mode", "Chat"] as const;
type Tab = typeof TABS[number];

export default function ResultsDashboard({ paperId }: { paperId: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("Summary");
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    getSummary(paperId)
      .then(setSummary)
      .catch(console.error)
      .finally(() => setSummaryLoading(false));
  }, [paperId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatKey = (key: string) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-6 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Upload
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Research Paper</h1>
            <span className="px-3 py-1 rounded-md text-sm font-mono font-medium bg-gray-100 text-gray-600 border border-gray-200">
              ID: {paperId}
            </span>
          </div>
          <Link href="/" className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 hover:shadow transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Upload New Paper
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 mb-8 overflow-x-auto pb-px">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg flex items-center
              ${activeTab === tab 
                ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            {tab === "Summary" && <FileText className="w-4 h-4 mr-2" />}
            {tab === "Quality Score" && <BarChart2 className="w-4 h-4 mr-2" />}
            {tab === "Reviewer Mode" && <CheckCircle className="w-4 h-4 mr-2" />}
            {tab === "Chat" && <MessageSquare className="w-4 h-4 mr-2" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "Summary" && (
          <div className="space-y-6">
            {summaryLoading ? (
              <div className="bg-white border border-gray-200 p-12 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">AI is reading and analyzing your paper...</p>
                <p className="text-sm text-gray-400">This may take a few moments depending on the document length.</p>
              </div>
            ) : !summary ? (
              <p>Failed to load summary.</p>
            ) : summary ? (
              <>
                <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">One-line summary</h3>
                  <p className="text-xl font-medium text-gray-900 leading-snug">{summary.one_line}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Executive summary</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{summary.executive}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Detailed summary</h3>
                  <p className={`text-gray-600 leading-relaxed whitespace-pre-wrap ${!expanded ? 'line-clamp-3' : ''}`}>
                    {summary.detailed}
                  </p>
                  {summary.detailed.length > 200 && (
                    <button 
                      onClick={() => setExpanded(!expanded)}
                      className="text-xs text-blue-500 mt-2 hover:underline"
                    >
                      {expanded ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              </>
            ) : null}
          </div>
        )}

        {activeTab === "Quality Score" && (
          <div className="space-y-8 bg-white border border-gray-200 p-8 sm:p-12 rounded-2xl shadow-sm">
            <div className="text-center">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Overall Score</h3>
              <div className={`text-7xl font-extrabold tracking-tighter ${getScoreColor(mockScores.overall)}`}>
                {mockScores.overall}<span className="text-4xl text-gray-300 font-medium">/100</span>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto pt-8 border-t space-y-6">
              {Object.entries(mockScores.scores).map(([dimension, score]) => (
                <div key={dimension} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-700">{formatKey(dimension)}</span>
                    <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getScoreBgColor(score)}`}
                      style={{ 
                        width: `${score}%`,
                        transition: 'width 0.6s ease-out'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Reviewer Mode" && (
          <div className="space-y-6">
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-2xl text-center">
              <p className="text-gray-500 font-medium text-lg">Reviewer analysis will appear here</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {["Strengths", "Weaknesses", "Reviewer Questions"].map(section => (
                <div key={section} className="bg-white border border-gray-200 p-6 rounded-2xl h-48 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 mb-2">{section}</h3>
                  <p className="text-sm text-gray-400">Pending AI analysis...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Chat" && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 h-[400px] flex flex-col items-center justify-center p-8 rounded-2xl text-center space-y-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
              <MessageSquare className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Chat with your paper coming in Sprint 4</h3>
            <p className="text-gray-500 max-w-md">You will be able to ask questions and interact with the AI about this paper directly here.</p>
          </div>
        )}
      </div>
    </main>
  );
}
