# chat_job

Публичный воркспейс ИИ-ассистента (форк механики `test_job` без баг-хантинг скиллов).

Здесь живёт конфигурация opencode для общения с нейросетью Mistral и выполнения
заданий владельца: ответы на вопросы, правки кода в основных репозиториях,
мелкие личные задачи. Краткая история диалогов складывается в приватный
репозиторий `chat_history`.

## Как это работает

- **Локально (основной режим):** Telegram-бот (`zerocracy-autojob/tg_bot`) принимает
  текст и голосовые, гоняет их через локальный `opencode run` в этом воркспейсе.
- **Через CI:** `Actions → chat → Run workflow` — задание уедет агенту на раннер,
  ответ и краткая история лягут в `chat_history`.

## Модели Mistral (free tier, проверено зондом 2026-09-07)

| Модель | Роль |
|---|---|
| `mistral/mistral-code-latest` | основная, самая мощная из доступных |
| `mistral/codestral-latest` | код-специалист, фолбэк |
| `mistral/ministral-14b-latest` | лёгкий фолбэк |
| `mistral/ministral-8b-latest` | small_model, служебные вызовы |
| `voxtral-mini-latest` | распознавание голосовых (транскрипция) |
| `voxtral-mini-tts-latest` | синтез речи (голоса пока только EN) |

`mistral-medium/small` и `magistral-*` на текущем free tier недоступны (429 всегда).

Ключ не хранится в репо: `opencode.json` читает `{env:MISTRAL_API_KEY}`.

## Плагины

- `oh-my-opencode` — агентские инструменты, LSP/AST, фоновые задачи (авто-ставится из конфига).
- `.opencode/plugins/chat-logger.js` — локальный журнал использования модели (`.ai/usage.log`).

## Секреты CI

- `MISTRAL_API_KEY` — ключ Mistral.
- `DELIVER_TOKEN` — токен с правом пуша в `chat_history`.
