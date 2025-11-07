🎯 Plinko Lab — Provably Fair Game

Daphnis Labs — Full-Stack Developer Intern Take-Home

Interactive Plinko with commit–reveal RNG, deterministic replay, and a public verifier. Built with Next.js, Node.js, TypeScript, and Prisma.

Live App: https://plinko-bice.vercel.app

🧠 Overview

Provably-fair commit–reveal protocol (serverSeed + clientSeed + nonce)

Deterministic engine with replayable outcome and path

Polished UI: Canvas animation, sound (mute toggle), responsive & accessible

Verifier page: recompute and confirm logged rounds

API + DB logging: round lifecycle & hashes (Postgres via Prisma)

⚙️ Tech Stack

Frontend: Next.js 14 (App Router), React, TypeScript, Canvas
Backend: Next.js API routes / Node.js, Prisma ORM, PostgreSQL
Hashing: SHA-256 (Node crypto)
PRNG: xorshift32 seeded from combinedSeed
Deployment: Vercel

🔐 Fairness Protocol

commitHex = SHA256(serverSeed + ":" + nonce)
combinedSeed = SHA256(serverSeed + ":" + clientSeed + ":" + nonce)

All randomness derives from a deterministic PRNG seeded by combinedSeed.
Verifier uses the same PRNG order — peg map generation first, then path decisions.

Peg Bias Logic:
leftBias = 0.5 + (rand() - 0.5) * 0.2 (rounded to 6 decimals)
adj = (dropColumn - floor(R/2)) * 0.01
bias' = clamp(leftBias + adj, 0, 1)

🧮 Deterministic Engine

Rows: 12 Bins: 13

Each row: Left/Right decision based on PRNG vs bias′

pos = number of Right moves → final binIndex = pos

Animation visually follows deterministic outcome

Test Vector Example:
serverSeed = "b2a5f3f32a4d9c6ee7a8c1d33456677890abcdeffedcba0987654321ffeeddcc"
nonce = "42"
clientSeed = "candidate-hello"
dropColumn = 6
commitHex = bb9acdc67f3f18f3345236a01f0e5072596657a9005c7d8a22cff061451a6b34
combinedSeed = e1dddf77de27d395ea2be2ed49aa2a59bd6bf12ee8d350c16c008abd406c07e0
binIndex = 6 ✅

🧾 API Endpoints

POST /api/rounds/commit → Create round → { roundId, commitHex, nonce }
POST /api/rounds/:id/start → { clientSeed, betCents, dropColumn } → pegMapHash, path, bin
POST /api/rounds/:id/reveal → Reveal serverSeed
GET /api/rounds/:id → Fetch full round details (for UI + verifier)
GET /api/verify → Deterministic recompute for public verifier

🧰 Local Setup

Clone repository: git clone https://github.com/Shreytan/Plinko.git
 && cd Plinko

Install dependencies: npm install

Run migrations: npx prisma migrate deploy

Start development server: npm run dev

🌐 Environment Variables

DATABASE_URL="postgresql://neondb_owner:npg_fi5VQp3nOJqv@ep-fancy-tooth-adcm9snn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXT_PUBLIC_API_BASE="/api"

🧩 Scripts

npm run dev — Start development
npm run build — Build for production
npm run start — Run production build
npm run test — Run RNG / fairness unit tests

✅ Verifier Page

Route: /verify
Enter serverSeed, clientSeed, nonce, and dropColumn to reproduce results.
Displays ✅ if recomputed commitHex, combinedSeed, and binIndex match the stored round.

⚡ Accessibility & Performance

Keyboard support: ← / → to move, Space to drop

Mute toggle + reduced-motion support

Optimized for 60fps with minimal layout reflow

🤖 AI Usage

Used ChatGPT (GPT-5) for:

Fairness protocol documentation

API and Prisma schema structure

README drafting and technical proofreading
All hashing, PRNG, backend logic, and UI animation were implemented and verified manually.

Author: Shreyansh Shukla • © 2025
Live App: https://plinko-bice.vercel.app
