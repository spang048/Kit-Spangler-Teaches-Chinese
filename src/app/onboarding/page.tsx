"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SealStamp } from "@/components/ui/SealStamp";

const DAILY_GOALS = [5, 10, 15, 20] as const;
const HSK_LEVELS = [
  { level: 1, label: "HSK 1", desc: "Complete beginner — zero Chinese experience" },
  { level: 2, label: "HSK 2", desc: "Know 150+ words, basic sentences" },
  { level: 3, label: "HSK 3", desc: "Intermediate — can handle everyday topics" },
  { level: 4, label: "HSK 4", desc: "Upper intermediate — discuss a wide range of topics" },
  { level: 5, label: "HSK 5", desc: "Advanced — read newspapers and complex texts" },
  { level: 6, label: "HSK 6", desc: "Near-native — understand almost anything" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [dailyGoal, setDailyGoal] = useState<number>(10);
  const [hskLevel, setHskLevel] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleFinish() {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName.trim() || "Learner",
      daily_goal_min: dailyGoal,
      current_hsk: hskLevel,
      onboarding_complete: true,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #C8102E 0%, #8B0C1F 100%)" }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="chinese text-3xl font-bold text-white mb-1">司凯德教中文</h1>
        <p className="text-red-200 text-sm">Step {step} of 3</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100">
          <div
            className="h-1.5 transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%`, background: "#C8102E" }}
          />
        </div>

        <div className="p-8">
          {/* Step 1 — Name */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <span className="text-4xl">👋</span>
                <h2 className="text-xl font-bold text-gray-800 mt-2">What should we call you?</h2>
                <p className="text-sm text-gray-500 mt-1">Your name will appear on your profile</p>
              </div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                maxLength={30}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none mb-4"
              />
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: "#C8102E" }}
              >
                继续 Continue →
              </button>
            </div>
          )}

          {/* Step 2 — Daily goal */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <span className="text-4xl">⏱️</span>
                <h2 className="text-xl font-bold text-gray-800 mt-2">Daily study goal</h2>
                <p className="text-sm text-gray-500 mt-1">How many minutes per day?</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {DAILY_GOALS.map((min) => (
                  <button
                    key={min}
                    onClick={() => setDailyGoal(min)}
                    className="py-4 rounded-xl border-2 font-bold text-lg transition-all"
                    style={{
                      borderColor: dailyGoal === min ? "#C8102E" : "#E5E7EB",
                      color: dailyGoal === min ? "#C8102E" : "#374151",
                      background: dailyGoal === min ? "#FEF2F4" : "white",
                    }}
                  >
                    {min} min
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: "#C8102E" }}
              >
                继续 Continue →
              </button>
            </div>
          )}

          {/* Step 3 — HSK level */}
          {step === 3 && (
            <div>
              <div className="text-center mb-4">
                <span className="text-4xl">📚</span>
                <h2 className="text-xl font-bold text-gray-800 mt-2">Where do you start?</h2>
                <p className="text-sm text-gray-500 mt-1">Pick your current Chinese level</p>
              </div>
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {HSK_LEVELS.map(({ level, label, desc }) => (
                  <button
                    key={level}
                    onClick={() => setHskLevel(level)}
                    className="w-full text-left px-4 py-3 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: hskLevel === level ? "#C8102E" : "#E5E7EB",
                      background: hskLevel === level ? "#FEF2F4" : "white",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <SealStamp label={String(level)} size="sm" earned={hskLevel === level} />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>
              )}

              <button
                onClick={handleFinish}
                disabled={saving}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-60"
                style={{ background: "#C8102E" }}
              >
                {saving ? "保存中…" : "开始学习 Let's Start! 🎉"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
