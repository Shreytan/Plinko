# 🎯 Plinko Lab — Provably Fair Game

An interactive **provably-fair Plinko game** built with **Next.js**, **Node.js**, **TypeScript**, and **Prisma**.  
Implements a **commit–reveal RNG**, **deterministic replay**, and a **public verifier** ensuring full transparency and reproducibility.

**👨‍💻 Author:** Shreyansh Shukla  
**🏢 Context:** Daphnis Labs — Full-Stack Developer Intern Take-Home  
**🚀 Live App:** [https://plinko-bice.vercel.app](https://plinko-bice.vercel.app)

---

## 🧠 Overview & Key Features

- **Provably Fair:** Implements a complete **commit–reveal protocol** using `serverSeed`, `clientSeed`, and `nonce`, ensuring outcomes can be publicly verified.  
- **Deterministic Engine:** All randomness is derived from a single `combinedSeed`, allowing **exact replay and verification** of any round.  
- **Polished UI:** Canvas-based animation with smooth physics simulation, **sound effects** (with mute toggle), and **fully responsive** gameplay.  
- **Public Verifier:** Dedicated `/verify` page to validate outcomes by recomputing round data using disclosed seeds.  
- **Full-Stack Implementation:** Powered by **Next.js 14 App Router** for both UI and API, ensuring consistency and scalability.  
- **Database Logging:** Each game round (commit hash, outcomes, seeds) is logged in **PostgreSQL** via **Prisma ORM** for persistence and verifiability.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 14 (App Router), React, TypeScript, HTML5 Canvas |
| **Backend** | Node.js, Next.js API Routes |
| **Database** | PostgreSQL (NeonDB), Prisma ORM |
| **Hashing** | SHA-256 (`crypto` module) |
| **PRNG** | `xorshift32` (seeded from combinedSeed) |
| **Deployment** | Vercel |

---

## 🔐 Fairness Protocol

This project follows a **commit–reveal RNG scheme** for provable fairness.

### 🧩 1. Commit Phase
Before gameplay begins:
- The **server** generates a random `serverSeed` and `nonce`.  
- It publishes only the **commitment hash**:
  ```
  commitHex = SHA256(serverSeed + ":" + nonce)
  ```

### 🧩 2. Play Phase
When the player starts:
- The **client** provides a `clientSeed`.  
- The **server** combines both seeds:
  ```
  combinedSeed = SHA256(serverSeed + ":" + clientSeed + ":" + nonce)
  ```
- All random events (peg generation + ball movement) use a PRNG initialized with `combinedSeed`.

### 🧩 3. Reveal Phase
After the round:
- The server reveals `serverSeed`.  
- The verifier (or player) can recompute `commitHex` and `combinedSeed` to confirm fairness.

All randomness is deterministic — every replay with the same inputs produces **identical outcomes**.

---

## ⚖️ Peg Bias Logic

A small, **verifiable bias** adds variability based on the selected drop column.

```js
// 1. Base bias from PRNG
leftBias = 0.5 + (rand() - 0.5) * 0.2; // rounded to 6 decimals

// 2. Column-based adjustment (R = 12)
adj = (dropColumn - floor(R/2)) * 0.01;

// 3. Final clamped bias
bias_prime = clamp(leftBias + adj, 0, 1);
```

---

## 🧮 Deterministic Engine

| Parameter | Description |
|------------|--------------|
| **Rows** | 12 |
| **Bins** | 13 |
| **Logic** | Each row = Left/Right decision based on PRNG vs bias′ |
| **Final Bin** | Equal to count of "Right" moves |

Every decision is reproducible from the same `combinedSeed`.

### ✅ Test Vector Example  
Use these on the `/verify` page to test determinism.

```
serverSeed   = "b2a5f3f32a4d9c6ee7a8c1d33456677890abcdeffedcba0987654321ffeeddcc"
nonce        = "42"
clientSeed   = "candidate-hello"
dropColumn   = 6
commitHex    = bb9acdc67f3f18f3345236a01f0e5072596657a9005c7d8a22cff061451a6b34
combinedSeed = e1dddf77de27d395ea2be2ed49aa2a59bd6bf12ee8d350c16c008abd406c07e0
binIndex     = 6 ✅
```

---

## 🧾 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **POST** | `/api/rounds/commit` | Creates a new round → `{ roundId, commitHex, nonce }` |
| **POST** | `/api/rounds/:id/start` | Starts game → `{ clientSeed, betCents, dropColumn }` → returns `pegMapHash`, `path`, `binIndex`, `payoutMultiplier` |
| **POST** | `/api/rounds/:id/reveal` | Reveals `serverSeed` after completion |
| **GET** | `/api/rounds/:id` | Fetches full round details for verification |
| **POST** | `/api/verify` | Public recompute endpoint to verify outcomes |

---

## 🧰 Local Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/Shreytan/Plinko.git
   cd Plinko
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Environment Variables**
   Create `.env.local` in the root:
   ```
   DATABASE_URL="postgresql://neondb_owner:npg_fi5VQp3nOJqv@ep-fancy-tooth-adcm9snn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   NEXT_PUBLIC_API_BASE="/api"
   ```
4. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```
5. **Start Server**
   ```bash
   npm run dev
   ```

App runs locally on **http://localhost:3000**.

---

## 🧩 Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Run the production build |
| `npm run test` | Execute RNG and fairness unit tests |

---

## ⚡ Accessibility & Performance

- 🎮 **Keyboard Controls:** ← / → to move, **Space** to drop  
- 🔇 **Audio Control:** Mute toggle for in-game sounds  
- 🚀 **Performance:** Optimized for 60fps rendering  
- ♿ **Accessibility:** Supports `prefers-reduced-motion`

---

## 🤖 AI Usage

**ChatGPT (GPT-5)** was used for:
- Structuring this README  
- Drafting fairness documentation & API schema layout  
- Proofreading and improving clarity  

All **core logic**, including hashing, PRNG, backend routes, and animations, was **implemented and tested manually**.

---

<p align="center">
© 2025 <strong>Shreyansh Shukla</strong> • <a href="https://plinko-bice.vercel.app">plinko-bice.vercel.app</a>
</p>
