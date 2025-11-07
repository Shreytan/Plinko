"use client";

import { useState, useRef } from "react";
import axios from "axios";
import confetti from "canvas-confetti";

// --- SVG Icons ---
// Using inline SVGs to avoid external dependencies.

const IconVolume2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const IconVolumeX = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);

const IconDice = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
    <path d="M16 8h.01"></path>
    <path d="M8 8h.01"></path>
    <path d="M12 12h.01"></path>
    <path d="M16 16h.01"></path>
    <path d="M8 16h.01"></path>
  </svg>
);

const IconPlay = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const IconPuzzle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 7V4.8C14 3.1 12.3 2 10.5 2S7 3.1 7 4.8V7m0 5v4.8c0 1.7 1.8 3 3.5 3s3.5-1.3 3.5-3V12m5-5v1.8c0 1.7 1.8 3 3.5 3s3.5-1.3 3.5-3V7m-1.5 5c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5h-1c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5m-20 0c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5h-1c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5"></path>
    <path d="M7 12v1.8c0 1.7-1.8 3-3.5 3S0 15.5 0 13.8V12m1.5-5c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5h-1c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5"></path>
  </svg>
);

const IconCheck = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// --- Component ---

export default function Home() {
  const [round, setRound] = useState<any>(null);
  const [clientSeed, setClientSeed] = useState("");
  const [dropColumn, setDropColumn] = useState(6);
  const [betCents, setBetCents] = useState(100);
  const [serverSeedInput, setServerSeedInput] = useState("");
  const [verifyRes, setVerifyRes] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);

  const pegSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  const PAYTABLE = [9, 6, 4, 3, 2, 1.5, 1, 1.5, 2, 3, 4, 6, 9];

  function playSound(ref: React.RefObject<HTMLAudioElement | null>) {
    if (!muted && ref.current) {
      try {
        ref.current.currentTime = 0;
        ref.current.play();
      } catch {
        // ignore playback errors
      }
    }
  }

  async function createRound() {
    try {
      setLoading(true);
      console.log("Creating round...");

      const res = await axios.post("/api/rounds/commit");
      console.log("Commit response:", res.data);

      setRound({
        roundId: res.data.roundId,
        commitHex: res.data.commitHex,
        nonce: res.data.nonce,
      });

      setVerifyRes(null);
      alert("✅ Round created! Now click 'Start Round'"); // User's original logic
    } catch (err: any) {
      console.error("Create error:", err.response?.data || err.message);
      alert("❌ Error: " + (err.response?.data?.error || err.message)); // User's original logic
    } finally {
      setLoading(false);
    }
  }

  async function startRound() {
    if (!round?.roundId) return alert("⚠️ Create a round first!"); // User's original logic
    try {
      setLoading(true);
      console.log("Starting round...");

      const res = await axios.post(`/api/rounds/${round.roundId}/start`, {
        clientSeed: clientSeed || Math.random().toString(36),
        dropColumn: Number(dropColumn),
        betCents: Number(betCents),
      });

      console.log("Start response:", res.data);

      setRound((prev: any) => ({
        ...prev,
        ...res.data,
        binIndex: res.data.binIndex,
        payoutMultiplier: res.data.payoutMultiplier,
        pegMapHash: res.data.pegMapHash,
        path: res.data.path,
      }));

      for (let i = 0; i < 12; i++) {
        setTimeout(() => playSound(pegSoundRef), i * 150);
      }

      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
        playSound(winSoundRef);
      }, 1900);

      alert( // User's original logic
        `✅ Game Complete! Landed in bin ${res.data.binIndex}, Payout: ${res.data.payoutMultiplier}x`
      );
    } catch (err: any) {
      console.error("Start error:", err.response?.data || err.message);
      alert("❌ Error: " + (err.response?.data?.error || err.message)); // User's original logic
    } finally {
      setLoading(false);
    }
  }

  async function revealRound() {
    if (!round?.roundId) return alert("⚠️ Create a round first!"); // User's original logic
    if (!serverSeedInput) return alert("⚠️ Enter serverSeed from Prisma Studio!"); // User's original logic

    try {
      setLoading(true);
      console.log("Revealing round...");

      const res = await axios.post(`/api/rounds/${round.roundId}/reveal`, {
        serverSeed: serverSeedInput,
      });

      console.log("Reveal response:", res.data);
      alert("✅ Reveal successful!\n" + JSON.stringify(res.data, null, 2)); // User's original logic
    } catch (err: any) {
      console.error("Reveal error:", err.response?.data || err.message);
      alert("❌ Error: " + (err.response?.data?.error || err.message)); // User's original logic
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    if (!round) return alert("⚠️ No round to verify!"); // User's original logic
    if (!serverSeedInput) return alert("⚠️ Enter serverSeed!"); // User's original logic

    try {
      setLoading(true);
      console.log("Verifying round...");

      const res = await axios.post("/api/verify", {
        serverSeed: serverSeedInput,
        clientSeed: clientSeed || "",
        nonce: round.nonce,
        dropColumn: Number(dropColumn),
      });

      console.log("Verify response:", res.data);
      setVerifyRes(res.data);
    } catch (err: any) {
      console.error("Verify error:", err.response?.data || err.message);
      alert("❌ Error: " + (err.response?.data?.error || err.message)); // User's original logic
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-gray-100 font-sans p-4 md:p-8">
      {/* --- Header --- */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-4 px-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white shadow-sm">
          🎯 Plinko Fair Game
        </h1>
        <button
          onClick={() => setMuted((m) => !m)}
          className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all"
        >
          {muted ? (
            <IconVolumeX className="w-5 h-5" />
          ) : (
            <IconVolume2 className="w-5 h-5" />
          )}
        </button>
      </header>

      <p className="text-gray-400 text-center text-sm md:text-base max-w-2xl mx-auto mt-2 mb-8">
        A provably fair Plinko engine with commit–reveal, deterministic RNG, and
        reproducible results.
      </p>

      {/* --- Main Content Grid --- */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Left Column: Controls --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* --- Control Panel Card --- */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-5 md:p-6 space-y-5">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Control Panel
            </h2>

            {/* Row 1: Create + Client Seed */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={createRound}
                disabled={loading}
                className="flex-shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <IconDice className="w-5 h-5" />
                {loading ? "Processing..." : "Create Round"}
              </button>
              <input
                placeholder="Client Seed (auto-generated if empty)"
                value={clientSeed}
                onChange={(e) => setClientSeed(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Row 2: Inputs + Start */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Column (0-12)
                </label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={dropColumn}
                  onChange={(e) => setDropColumn(Number(e.target.value))}
                  className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Bet (cents)
                </label>
                <input
                  type="number"
                  min="10"
                  value={betCents}
                  onChange={(e) => setBetCents(Number(e.target.value))}
                  className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={startRound}
                disabled={loading || !round}
                className="col-span-2 sm:col-span-1 h-full sm:self-end inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                <IconPlay className="w-5 h-5" />
                Start Round
              </button>
            </div>
          </div>

          {/* --- Verification Card --- */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-5 md:p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Verification
            </h2>
            <input
              placeholder="Paste serverSeed (from Prisma Studio)"
              value={serverSeedInput}
              onChange={(e) => setServerSeedInput(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={revealRound}
                disabled={loading || !round}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-black font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              >
                <IconPuzzle className="w-5 h-5" />
                Reveal
              </button>
              <button
                onClick={verify}
                disabled={loading || !round}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                <IconCheck className="w-5 h-5" />
                Verify
              </button>
            </div>
          </div>
        </div>

        {/* --- Right Column: Paytable --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-5 md:p-6">
            <h3 className="text-xl font-semibold text-center text-white mb-4">
              💰 Paytable
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-4 gap-2 text-center text-sm">
              {PAYTABLE.map((p, i) => (
                <div
                  key={i}
                  className="bg-gray-900/70 border border-gray-700 p-2 rounded-md transition-all hover:scale-105 hover:bg-gray-800"
                >
                  <div className="text-xs text-gray-400">Bin {i}</div>
                  <div className="font-bold text-blue-400 text-lg">{p}x</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- Results Area (Full Width) --- */}
      <div className="w-full max-w-6xl mx-auto space-y-6 mt-6">
        
        {/* --- Current Round Card --- */}
        {round && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-5 md:p-6">
            <h2 className="font-semibold mb-3 text-xl text-white">
              Current Round
            </h2>
            <pre className="text-sm bg-gray-950 text-gray-200 p-4 rounded-lg overflow-auto">
              {JSON.stringify(round, null, 2)}
            </pre>
          </div>
        )}

        {/* --- Verification Result Card --- */}
        {verifyRes && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-5 md:p-6">
            <h2 className="font-semibold mb-3 text-xl text-white">
              Verification Result
            </h2>
            <pre className="text-sm bg-gray-950 text-gray-200 p-4 rounded-lg overflow-auto">
              {JSON.stringify(verifyRes, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* --- Audio Elements --- */}
      <audio ref={pegSoundRef} src="/sounds/peg-tick.mp3" preload="auto" />
      <audio ref={winSoundRef} src="/sounds/win-chime.mp3" preload="auto" />
    </main>
  );
}