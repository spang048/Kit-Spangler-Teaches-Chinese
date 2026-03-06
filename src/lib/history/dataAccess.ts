import type { HistoryTopic, HistoryIndex } from "@/types/history";

export function getHistoryIndex(): HistoryIndex {
  return require("@/data/history/index.json");
}

export function getHistoryTopic(topicId: string): HistoryTopic | undefined {
  try {
    return require(`@/data/history/${topicId}.json`);
  } catch {
    return undefined;
  }
}

export function getAllHistoryTopics(): HistoryTopic[] {
  const index = getHistoryIndex();
  return index.topics
    .map((t) => getHistoryTopic(t.id))
    .filter((t): t is HistoryTopic => t !== undefined);
}
