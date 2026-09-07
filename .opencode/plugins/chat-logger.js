import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// Локальный плагин: пишет журнал использования модели в .ai/usage.log.
// Полезно для контроля расходов free tier и отладки сессий.
export const ChatLogger = async ({ directory }) => {
  const dir = join(directory, ".ai");
  try {
    mkdirSync(dir, { recursive: true });
  } catch {}
  const log = join(dir, "usage.log");
  const line = (m) => {
    try {
      appendFileSync(log, m + "\n");
    } catch {}
  };
  line(`# events ${new Date().toISOString()}`);
  return {
    event: async ({ event }) => {
      try {
        if (event.type === "message.updated") {
          const info = event.properties?.info;
          if (info?.role === "assistant" && info?.tokens) {
            const t = info.tokens;
            line(
              `${new Date().toISOString()} model=${info.modelID ?? "?"} ` +
                `in=${t.input ?? 0} out=${t.output ?? 0} cache_read=${t.cache?.read ?? 0} ` +
                `cost=${info.cost ?? 0}`,
            );
          }
        }
        if (event.type === "session.error") {
          line(
            `${new Date().toISOString()} ERROR ${JSON.stringify(event.properties ?? {}).slice(0, 400)}`,
          );
        }
      } catch {}
    },
  };
};
