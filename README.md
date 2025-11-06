# Telephony AMD System

A reference implementation of a multi-strategy answering machine detection (AMD) dialer built with Next.js 14, Twilio, Prisma, and complementary AI services. The project demonstrates how to orchestrate outbound calls, stream audio to specialized AMD providers, and persist analytics in Postgres.

## Features

- 🔐 **Authentication with Better Auth** – pluggable email+password flow backed by Prisma.
- ☎️ **Outbound Dialer UI** – choose between four AMD strategies and initiate Twilio calls.
- 🧠 **AMD Strategy Abstraction** – swap between Twilio native AMD, a SIP routed Jambonz deployment, a Hugging Face wav2vec microservice, or Google Gemini 2.5 Flash.
- 📊 **Call Analytics** – Prisma schema for storing detection outcomes, latency, and confidence metrics.
- 🧩 **Python AI Service** – FastAPI stub for low-latency wav2vec voicemail detection.
- 📚 **Documentation First** – architecture diagram, environment variables, and testing notes.

## Architecture

```mermaid
graph TD
  A[Next.js App Router] -->|fetch /api/dial| B(Telephony Orchestrator)
  B -->|machineDetection async AMD| C[Twilio Voice]
  B -->|log| D[(Postgres/Prisma)]
  C -->|status callbacks| 
  C -->|media stream| F[Realtime Audio Router]
  F -->|strategy factory| G{AMD Detector}
  G --> H1[Twilio Native]
  G --> H2[Jambonz SIP]
  G --> H3[Hugging Face FastAPI]
  G --> H4[Gemini Flash Streaming]
  H3 --> I[GPU Optimized Wav2Vec]
  H4 --> J[Gemini Live Session]
  B --> K[Agent Bridge]
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables**
   - Copy `.env.example` to `.env.local` and fill in Twilio, database, and AI credentials.
3. **Database migrations**
   ```bash
   npx prisma migrate dev
   ```
4. **Python AI service**
   ```bash
   cd python-service
   uv venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
5. **Run Next.js**
   ```bash
   npm run dev
   ```

> **Note:** Network access for package downloads is required. In offline environments you may need to mirror npm/pip registries.

## AMD Strategy Comparison

| Strategy | Accuracy (est.) | Latency Target | Cost Considerations |
| --- | --- | --- | --- |
| Twilio Native AMD | 82-88% on short greetings after tuning `asyncAmd` callbacks | ~1.5 s | Included in voice minute pricing; no extra infra |
| Twilio + Jambonz | 88-92% leveraging custom recognizers and configurable timers | ~2.2 s | Requires SIP trunk + Jambonz hosting (~$40/mo self-hosted) |
| Hugging Face Wav2Vec | 90-94% with ONNX optimized model and curated voicemail set | ~2.5 s | GPU/CPU workload on FastAPI service; <$0.10 per 100 calls on A10G spot |
| Gemini 2.5 Flash | 85-90% but excels in ambiguous cases with natural language prompts | ~2.8 s | Pay-per-minute streaming tokens; ideal for high-value calls |

## Key Trade-offs

- **Latency vs. Accuracy:** Twilio native AMD is fastest but prone to false positives on short "hello" greetings. Jambonz offers deeper tuning at the cost of SIP routing complexity. Neural approaches (Hugging Face/Gemini) produce higher confidence in noisy environments but add ~1 second of processing.
- **Operational Complexity:** External AI services require additional observability (health checks, retries). The strategy factory isolates concerns so the dialer can degrade gracefully when a provider is offline.
- **Cost Controls:** Gemini streaming should be reserved for premium leads; the orchestrator can dynamically pick strategies based on lead score.

## Testing Plan

| Scenario | Expected Outcome | Validation |
| --- | --- | --- |
| Dial Costco voicemail (1-800-774-2678) | AMD reports `machine` within 3 seconds and hangs up | Inspect `/api/amd-events` logs and Postgres row |
| Dial personal mobile | AMD reports `human` and connects to bridge | Agent bridge logs and Twilio console |
| Silence for 3 seconds | Detector returns `timeout` with low confidence | UI badge highlights fallback |
| Gemini low confidence (<0.7) | Retries inference twice before defaulting to human | Log metadata `retryCount` |

## Folder Structure

```
src/
  app/                 # Next.js App Router routes
  components/          # Dialer UI and auth forms
  server/              # Backend orchestrators, Prisma, AMD strategy facades
  styles/              # Tailwind entry point
python-service/        # FastAPI wav2vec inference stub
prisma/                # Prisma schema
```

## Deployment Notes

- Deploy the Next.js app on Vercel or a container platform with serverless functions disabled for `/api/voice/*` routes to retain low-latency processing.
- Expose the Python service via HTTPS (ngrok or Load Balancer) and restrict by IP allow-list.
- Configure Twilio Event Streams for richer analytics and integrate with the Prisma `CallLog` table.

## Next Steps

- Implement websocket fan-out for Twilio Media Streams to feed detectors in real-time.
- Automate canary testing that dials voicemail fixtures nightly to measure drift.
- Add agent console for live monitoring, manual overrides, and call escalation.

