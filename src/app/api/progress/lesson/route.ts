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
  const { lessonId, score, xpEarned } = body as {
    lessonId: string;
    score: number;
    xpEarned: number;
  };

  if (!lessonId || score == null || xpEarned == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const userId = user.id;

  // 1. Upsert lesson_progress
  await supabase.from("lesson_progress").upsert(
    { user_id: userId, lesson_id: lessonId, completed: true, score, xp_earned: xpEarned },
    { onConflict: "user_id,lesson_id" }
  );

  // 2. Add XP transaction + update total_xp
  await supabase.from("xp_transactions").insert({
    user_id: userId,
    amount: xpEarned,
    source_type: "lesson",
    source_id: lessonId,
  });

  await supabase.rpc("increment_xp", { uid: userId, amount: xpEarned });

  // 3. Update daily_activity
  const today = new Date().toISOString().slice(0, 10);
  const { data: existing } = await supabase
    .from("daily_activity")
    .select("minutes_studied, goal_completed")
    .eq("user_id", userId)
    .eq("activity_date", today)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("daily_goal_min")
    .eq("id", userId)
    .single();

  const dailyGoal = profile?.daily_goal_min ?? 10;
  const newMinutes = (existing?.minutes_studied ?? 0) + 5; // ~5 min per lesson
  const goalComplete = newMinutes >= dailyGoal;

  await supabase.from("daily_activity").upsert(
    {
      user_id: userId,
      activity_date: today,
      minutes_studied: newMinutes,
      goal_completed: goalComplete,
    },
    { onConflict: "user_id,activity_date" }
  );

  // 4. Update streak if goal newly completed
  if (goalComplete && !existing?.goal_completed) {
    await supabase.rpc("update_streak", { uid: userId });
  }

  // 5. Check achievements
  const { data: allProgress } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("completed", true);

  const { data: earnedRows } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  const { data: streakRow } = await supabase
    .from("streaks")
    .select("current_streak")
    .eq("user_id", userId)
    .single();

  const { data: profileXp } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", userId)
    .single();

  const earnedIds = new Set((earnedRows ?? []).map((r) => r.achievement_id as string));
  const completedLessons = (allProgress ?? []).length;
  const currentStreak = streakRow?.current_streak ?? 0;
  const totalXp = profileXp?.total_xp ?? 0;

  const newlyUnlocked = checkNewAchievements({
    lessonCount: completedLessons,
    streakDays: currentStreak,
    completedHskLevels: [],
    historyCount: 0,
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
    goalComplete,
    newAchievements: newlyUnlocked.map((a) => a.id),
  });
}
