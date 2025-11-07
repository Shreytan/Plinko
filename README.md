# ÌæØ Plinko Lab ‚Äî Provably Fair Game
**Daphnis Labs ‚Äî Full-Stack Developer Intern Take-Home**
Interactive **Plinko** with **commit‚Äìreveal RNG**, **deterministic replay**, and a public **verifier**. Built with **Next.js**, **Node.js**, **TypeScript**, and **Prisma**.
Ìºê **Live App:** [https://plinko-bice.vercel.app](https://plinko-bice.vercel.app)
---
## Overview
- **Provably-fair** commit‚Äìreveal protocol (serverSeed + clientSeed + nonce)
- **Deterministic engine** (replayable outcome & path)
- **Polished UI:** canvas animation, sound (mute toggle), responsive & accessible
- **Verifier page:** recompute + confirm logged rounds
- **API + DB logging:** round lifecycle & hashes (Postgres via Prisma)
---
## ‚öôÔ∏è Tech Stack
**Frontend:** Next.js 14 (App Router), React, TypeScript, Canvas  
**Backend:** Next.js API routes / Node.js, Prisma ORM, PostgreSQL  
**Hashing:** SHA-256 (`crypto`)  
**PRNG:** `xorshift32` seeded from `combinedSeed`  
**Deployment:** Vercel  
---
## Ì¥ê Fairness Protocol
\`\`\`
commitHex   = SHA256(serverSeed + ":" + nonce)
combinedSeed= SHA256(serverSeed + ":" + clientSeed + ":" + nonce)
\`\`\`
All randomness derives from a deterministic PRNG seeded by `combinedSeed`. Verifier uses the **exact same PRNG order**: peg map ‚Üí row decisions.  
**Peg Bias Logic**  
`leftBias = 0.5 + (rand() - 0.5) * 0.2` (rounded to 6 decimals)  
`adj = (dropColumn - floor(R/2)) * 0.01`  
`bias' = clamp(leftBias + adj, 0, 1)`
---
## Ì∑Æ Deterministic Engine
- **Rows:** 12‚ÄÉ**Bins:** 13  
- Each row ‚Üí Left/Right based on PRNG vs bias‚Ä≤  
- `pos` = number of Right moves ‚Üí **final binIndex = pos**  
- Animation follows deterministic path  
**Test Vector Example**
\`\`\`
serverSeed   = "b2a5f3f32a4d9c6ee7a8c1d33456677890abcdeffedcba0987654321ffeeddcc"
nonce        = "42"
clientSeed   = "candidate-hello"
dropColumn   = 6
commitHex    = bb9acdc67f3f18f3345236a01f0e5072596657a9005c7d8a22cff061451a6b34
combinedSeed = e1dddf77de27d395ea2be2ed49aa2a59bd6bf12ee8d350c16c008abd406c07e0
binIndex     = 6 ‚úÖ
\`\`\`
---
## Ì∑æ API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rounds/commit` | Create round ‚Üí `{ roundId, commitHex, nonce }` |
| POST | `/api/rounds/:id/start` | `{ clientSeed, betCents, dropColumn }` ‚Üí pegMapHash, path, bin |
| POST | `/api/rounds/:id/reveal` | Reveal `serverSeed` |
| GET | `/api/rounds/:id` | Full round details for UI & verifier |
| GET | `/api/verify` | Deterministic recompute for public verifier |
---
## Ì∑∞ Local Setup
\`\`\`bash
git clone https://github.com/Shreytan/Plinko.git
cd Plinko
npm install
npx prisma migrate deploy
npm run dev
\`\`\`
### Environment Variables
\`\`\`ini
# Production (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_fi5VQp3nOJqv@ep-fancy-tooth-adcm9snn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXT_PUBLIC_API_BASE="/api"
\`\`\`
### Scripts
\`\`\`bash
npm run dev      # start dev server
npm run build    # build for production
npm run start    # start prod build
npm run test     # run RNG/unit tests
\`\`\`
---
## ‚úÖ Verifier Page
Route: **`/verify`**  
Enter `serverSeed`, `clientSeed`, `nonce`, `dropColumn` to reproduce results. Displays ‚úÖ if recomputed `commitHex`, `combinedSeed`, and `binIndex` match the stored round.
---
## Ìæ® Accessibility & Performance
- Keyboard support: ‚Üê/‚Üí to move, **Space** to drop  
- Mute toggle + reduced motion support  
- Targets **60fps**, optimized DOM & layout updates  
---
## Ì¥ñ AI Usage
Used **ChatGPT (GPT-5)** for:
- Fairness protocol documentation  
- API design + Prisma schema outline  
- README drafting + TypeScript optimizations  
All hashing, PRNG, API routes, and animation logic were written and verified manually.
---
**Author:** Shreyansh Shukla ‚Ä¢ ¬© 2025  
Ìºê Live App: [https://plinko-bice.vercel.app](https://plinko-bice.vercel.app)
