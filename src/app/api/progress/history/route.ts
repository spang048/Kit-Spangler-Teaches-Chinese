import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkNewAchievements } from "@/lib/achievements/dataAccess";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { topicId, score, xpEarned } = body as {
    topicId: string;
    score: number;
    xpEarned: number;
  };

  if (!topicId || score == null || xpEarned == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const userId = user.id;

  // 1. Upsert history_progress
  await supabase.from("history_progress").upsert(
    {
      user_id: userId,
      topic_id: topicId,
      article_read: true,
      quiz_completed: true,
      quiz_score: score,
    },
    { onConflict: "user_id,topic_id" }
  );

  // 2. XP
  await supabase.from("xp_transactions").insert({
    user_id: userId,
    amount: xpEarned,
    source_type: "history_quiz",
    source_id: topicId,
  });
  await supabase.rpc("increment_xp", { uid: userId, amount: xpEarned });

  // 3. Check achievements
  const { data: earnedRows } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  const { data: historyRows } = await supabase
    .from("history_progress")
    .select("topic_id")
    .eq("user_id", userId)
    .eq("quiz_completed", true);

  const { data: streakRow } = await supabase
    .from("streaks")
    .select("current_streak")
    .eq("user_id", userId)
    .single();

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", userId)
    .single();

  const earnedIds = new Set((earnedRows ?? []).map((r) => r.achievement_id as string));
  const historyCount = (historyRows ?? []).length;
  const currentStreak = streakRow?.current_streak ?? 0;
  const totalXp = profileRow?.total_xp ?? 0;

  const newlyUnlocked = checkNewAchievements({
    lessonCount: 0,
    streakDays: currentStreak,
    completedHskLevels: [],
    historyCount,
    hasPerfectScore: score === 100,
    totalXp,
    alreadyEarned: earnedIds,
  });

  if (newlyUnlocked.length > 0) {
    await supabase.from("user_achievements").insert(
      newlyUnlocked.map((a) => ({ user_id: userId, achievement_id: a.id }))
    );
  }

  return NextResponse.json({
    ok: true,
    newAchievements: newlyUnlocked.map((a) => a.id),
  });
}
