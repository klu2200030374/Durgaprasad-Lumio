# AI Meeting Summarizer (Full-Stack)

**Username:** `Durgaprasad-Lumio`

A minimal full-stack application to upload/paste a transcript, apply a custom prompt, get an AI-generated summary (editable), and share via email.

## Stack
- Next.js (pages router)
- Fetch-based AI calls (Groq or OpenAI)
- Resend (email) with SMTP fallback via Nodemailer
- Zero styling fuss – functional UI only

## Quick Start

```bash
git clone <your-repo-url>
cd lumio-meeting-summarizer
cp .env.example .env.local   # fill values
pnpm i # or npm i / yarn
pnpm dev # or npm run dev
```

Open http://localhost:3000

## Environment

```
AI_PROVIDER=groq                # or "openai"
GROQ_API_KEY=                   # required if AI_PROVIDER=groq
OPENAI_API_KEY=                 # required if AI_PROVIDER=openai

RESEND_API_KEY=                 # recommended on Vercel

# OR configure SMTP if not using Resend
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
FROM_EMAIL="Meeting Summarizer <no-reply@example.com>"
```

## API

### POST `/api/summarize`
Body:
```json
{ "transcript": "string", "prompt": "string" }
```
Response:
```json
{ "summary": "string" }
```

### POST `/api/send-email`
Body:
```json
{ "to": "a@b.com, c@d.com", "summary": "content" }
```
Response:
```json
{ "ok": true }
```

## Deploy (Vercel)
1. Push to GitHub.
2. Import the repo in Vercel.
3. Add the env vars from `.env.example` into Vercel Project → Settings → Environment Variables.
4. Deploy.

## Notes
- For Groq, default model is `llama-3.1-8b-instant`. Override with `GROQ_MODEL` if desired.
- For OpenAI, default model is `gpt-4o-mini`. Override with `OPENAI_MODEL` if desired.
- Frontend is intentionally simple to match the assignment.
