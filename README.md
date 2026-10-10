# AI Task Assistant

A lightweight, responsive personal task manager. The first release focuses on a dependable workflow before adding an external LLM or autonomous actions.

## Current MVP
- Add tasks with due date and priority
- Quick capture from a natural-language note
- Preview and confirm the parsed task before saving
- Basic English and Arabic date/priority phrase recognition
- Complete and delete tasks; filter pending/completed
- Local persistence in the browser
- Responsive dashboard and safe HTML rendering

## Important implementation boundary
Quick capture currently uses a small, deterministic local parser. It is **not yet an LLM-powered AI feature** and does not call an external service. It recognizes common phrases such as today/tomorrow and اليوم/بكرا, plus priority words. The preview is deliberately user-confirmed because date and priority inference can be wrong.

## Architecture principles from primary-source agent engineering guidance
1. Start with the simplest workflow that meets the use case; introduce autonomous agent behavior only when it adds measurable value.
2. Separate task interpretation from task persistence and execution.
3. Keep consequential actions behind explicit user confirmation.
4. Add durable, per-user memory only when a backend and authentication model exist.
5. Add structured logs/traces and a repeatable evaluation set before claiming production reliability.
6. Keep API keys on a server, never in browser JavaScript.

## Run
Open `index.html` in a modern browser. No build step or API key is required.

## Roadmap
- Replace/augment the local parser with a server-side LLM adapter and validated structured output
- Add tests for date extraction, priority inference, and malformed inputs
- Add authentication and database persistence
- Add reminders and calendar integrations with explicit permissions
- Add execution history, error handling, evaluations, and observability before autonomous tool use