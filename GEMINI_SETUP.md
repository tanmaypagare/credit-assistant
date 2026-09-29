# Gemini setup

The advisor calls Google Gemini **only from the server** through the official `@google/generative-ai` SDK. The browser never receives the API key.

Set these project environment variables through the WebDev secrets manager or your local shell:

```bash
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-1.5-flash
```

`GEMINI_API_KEY` is optional for the demo: if it is absent or Gemini is temporarily unavailable, Credit Assistant returns a deterministic, CIBIL-aware local guidance plan so the rest of the app remains usable. Replace the model name with any Gemini model enabled for your account if needed.
