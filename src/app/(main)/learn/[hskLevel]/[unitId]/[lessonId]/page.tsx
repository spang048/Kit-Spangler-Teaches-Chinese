"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { LessonEngine } from "@/components/learn/LessonEngine";
import { getLessonById } from "@/lib/lesson-engine/dataAccess";
import { hydrateLesson } from "@/lib/lesson-engine/exerciseBuilder";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();

  const lessonId = params.lessonId as string;

  const hydratedLesson = useMemo(() => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return null;
    const exercises = hydrateLesson(lesson.exercises);
    return { id: lesson.id, xp_reward: lesson.xp_reward, exercises };
  }, [lessonId]);

  if (!hydratedLesson) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Lesson not found.</p>
      </div>
    );
  }

  function handleComplete(xpEarned: number, score: number) {
    void xpEarned; void score;
    router.back();
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <LessonEngine
        lesson={hydratedLesson}
        lessonId={lessonId}
        onComplete={handleComplete}
      />
    </div>
  );
}
