"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { getHistoryTopic } from "@/lib/history/dataAccess";
import { QuizEngine } from "@/components/history/QuizEngine";
import { SealStamp } from "@/components/ui/SealStamp";

export default function HistoryQuizPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;
  const topic = getHistoryTopic(topicId);
  const [result, setResult] = useState<{ xp: number; score: number } | null>(null);

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Topic not found.</p>
      </div>
    );
  }

  if (result) {
    const isPerfect = result.score === 100;
    return (
      <div className="flex flex-col items-center gap-6 px-6 pt-8 pb-10 text-center">
        <div className="animate-stamp-reveal">
          <SealStamp label={isPerfect ? "优" : "好"} earned size="lg" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isPerfect ? "Perfect score!" : "Quiz complete!"}
          </h2>
          <p className="text-gray-500 mt-1">You scored {result.score}%</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-6 py-3">
          <span className="text-2xl">⭐</span>
          <div className="text-left">
            <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wide">XP Earned</p>
            <p className="text-3xl font-bold text-yellow-700">+{result.xp}</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/history")}
          className="w-full max-w-xs py-4 rounded-2xl font-bold text-white active:scale-95 transition-transform"
          style={{ background: "#C8102E" }}
        >
          Back to History
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 pt-6 pb-2">
        <button onClick={() => router.back()} className="text-sm text-gray-400 mb-3 block">
          ← {topic.title}
        </button>
        <h1 className="text-lg font-bold text-gray-800">Quiz: {topic.title}</h1>
      </div>
      <QuizEngine
        questions={topic.quiz.questions}
        topicId={topicId}
        xpReward={topic.xp_reward}
        onComplete={(xp, score) => setResult({ xp, score })}
      />
    </div>
  );
}
