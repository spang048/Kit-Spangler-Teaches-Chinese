"use client";

import { useState } from "react";
import { useTTS } from "@/hooks/useTTS";
import type { HistoryTopic } from "@/types/history";

interface Props {
  topic: HistoryTopic;
}

export function ArticleReader({ topic }: Props) {
  const { speak, available: ttsAvailable } = useTTS();
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  return (
    <div className="px-4 py-2">
      {/* Kit's commentary */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
        <p className="text-xs font-bold text-red-600 mb-1">司凯德 says:</p>
        <p className="text-sm text-gray-700 italic">&ldquo;{topic.kit_commentary}&rdquo;</p>
      </div>

      {/* Article paragraphs */}
      <div className="flex flex-col gap-6">
        {topic.article.paragraphs.map((para) => (
          <div key={para.id}>
            <p className="text-gray-800 leading-relaxed text-base">{para.text}</p>

            {/* Vocab highlights */}
            {para.vocab_highlights.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {para.vocab_highlights.map((vh) => (
                  <button
                    key={vh.zh}
                    onClick={() => {
                      setActiveHighlight(activeHighlight === vh.zh ? null : vh.zh);
                      if (ttsAvailable) speak(vh.zh);
                    }}
                    className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm shadow-sm active:scale-95 transition-transform"
                  >
                    <span className="chinese font-bold text-red-700">{vh.zh}</span>
                    <span className="pinyin text-gray-500 text-xs">{vh.pinyin}</span>
                    {ttsAvailable && <span className="text-gray-300">🔊</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Expanded vocab card */}
            {para.vocab_highlights.map((vh) =>
              activeHighlight === vh.zh ? (
                <div
                  key={`card-${vh.zh}`}
                  className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-3"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="chinese text-xl font-bold text-red-700">{vh.zh}</span>
                    <span className="pinyin text-sm text-gray-500">{vh.pinyin}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{vh.word}</p>
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
