import type { VocabWord, VocabularyFile, Unit } from "@/types/lesson";

// ── Vocabulary ──────────────────────────────────────────────────────────────

const vocabCache = new Map<number, VocabWord[]>();

export function getVocabulary(hskLevel: number): VocabWord[] {
  if (vocabCache.has(hskLevel)) return vocabCache.get(hskLevel)!;

  let data: VocabularyFile;
  switch (hskLevel) {
    case 1:
      data = require("@/data/hsk/hsk1/vocabulary.json");
      break;
    default:
      return [];
  }

  vocabCache.set(hskLevel, data.words);
  return data.words;
}

export function getWordById(wordId: string): VocabWord | undefined {
  const level = parseInt(wordId.replace("hsk", "").split("-")[0]);
  const words = getVocabulary(level);
  return words.find((w) => w.id === wordId);
}

export function getWordsByIds(wordIds: string[]): VocabWord[] {
  return wordIds
    .map((id) => getWordById(id))
    .filter((w): w is VocabWord => w !== undefined);
}

// ── Units & Lessons ──────────────────────────────────────────────────────────

const unitCache = new Map<string, Unit>();

export function getUnit(hskLevel: number, unitIndex: number): Unit | undefined {
  const key = `hsk${hskLevel}-unit${unitIndex}`;
  if (unitCache.has(key)) return unitCache.get(key)!;

  try {
    let data: Unit;
    if (hskLevel === 1) {
      switch (unitIndex) {
        case 1: data = require("@/data/hsk/hsk1/unit1.json"); break;
        case 2: data = require("@/data/hsk/hsk1/unit2.json"); break;
        case 3: data = require("@/data/hsk/hsk1/unit3.json"); break;
        case 4: data = require("@/data/hsk/hsk1/unit4.json"); break;
        case 5: data = require("@/data/hsk/hsk1/unit5.json"); break;
        default: return undefined;
      }
    } else {
      return undefined;
    }
    unitCache.set(key, data);
    return data;
  } catch {
    return undefined;
  }
}

export function getAllUnitsForLevel(hskLevel: number): Unit[] {
  const units: Unit[] = [];
  for (let i = 1; i <= 5; i++) {
    const unit = getUnit(hskLevel, i);
    if (unit) units.push(unit);
  }
  return units;
}

export function getLessonById(lessonId: string) {
  // lessonId format: "hsk1-unit2-lesson3"
  const parts = lessonId.split("-");
  const hskLevel = parseInt(parts[0].replace("hsk", ""));
  const unitIndex = parseInt(parts[1].replace("unit", ""));
  const lessonIndex = parseInt(parts[2].replace("lesson", ""));

  const unit = getUnit(hskLevel, unitIndex);
  if (!unit) return undefined;
  return unit.lessons.find((l) => l.lesson_index === lessonIndex);
}

// ── Progression ──────────────────────────────────────────────────────────────

/**
 * Returns a Set of lesson IDs that are unlocked given the current progress.
 * Rule: a lesson is unlocked if all previous lessons in the same unit are done,
 * and the unit itself is unlocked (all lessons of previous unit done).
 */
export function getUnlockedLessonIds(
  hskLevel: number,
  completedLessonIds: Set<string>
): Set<string> {
  const unlocked = new Set<string>();
  const units = getAllUnitsForLevel(hskLevel);

  for (let ui = 0; ui < units.length; ui++) {
    const unit = units[ui];

    // First unit is always accessible
    // Subsequent units require all lessons of previous unit to be complete
    if (ui > 0) {
      const prevUnit = units[ui - 1];
      const prevUnitComplete = prevUnit.lessons.every((l) =>
        completedLessonIds.has(l.id)
      );
      if (!prevUnitComplete) break; // This and all subsequent units locked
    }

    // Unlock lessons within this unit sequentially
    for (let li = 0; li < unit.lessons.length; li++) {
      const lesson = unit.lessons[li];
      if (li === 0) {
        unlocked.add(lesson.id);
      } else {
        const prevLesson = unit.lessons[li - 1];
        if (completedLessonIds.has(prevLesson.id)) {
          unlocked.add(lesson.id);
        } else {
          break;
        }
      }
    }
  }

  return unlocked;
}

export function isHskLevelComplete(
  hskLevel: number,
  completedLessonIds: Set<string>
): boolean {
  const units = getAllUnitsForLevel(hskLevel);
  return units.every((unit) =>
    unit.lessons.every((l) => completedLessonIds.has(l.id))
  );
}
