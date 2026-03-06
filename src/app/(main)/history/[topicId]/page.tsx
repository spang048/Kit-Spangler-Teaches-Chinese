"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getHistoryTopic } from "@/lib/history/dataAccess";
import { ArticleReader } from "@/components/history/ArticleReader";

export default function HistoryTopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;
  const topic = getHistoryTopic(topicId);

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 gap-4">
        <p className="text-gray-500">Topic not found.</p>
        <button onClick={() => router.back()} className="text-sm text-red-600 font-semibold">
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="text-sm text-gray-400 mb-3 block">
          ← History
        </button>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-4xl">{topic.thumbnail_emoji}</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{topic.title}</h1>
            <p className="chinese text-sm text-gray-500">{topic.title_zh}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {topic.estimated_read_minutes} min read · {topic.xp_reward} XP · {topic.quiz.questions.length} quiz questions
        </p>
      </div>

      {/* Article */}
      <div className="pt-4">
        <ArticleReader topic={topic} />
      </div>

      {/* CTA */}
      <div className="px-4 pt-6">
        <Link
          href={`/history/${topicId}/quiz`}
          className="block w-full py-4 rounded-2xl font-bold text-white text-center text-base active:scale-95 transition-transform"
          style={{ background: "#C8102E" }}
        >
          Take the quiz →
        </Link>
      </div>
    </div>
  );
}
