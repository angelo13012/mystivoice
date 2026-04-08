import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, X, Play, Pause, Volume2 } from "lucide-react";
import { T } from "../tokens";
import { Glass } from "../components/ui/Glass";
import { VoiceWave } from "../components/ui/VoiceWave";

export function Discovery({ profiles, onLike, onPass }: any) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dir, setDir] = useState<string | null>(null);
  const p = profiles[idx % profiles.length];

  const act = (a: string) => {
    setDir(a === "like" ? "right" : "left"); setPlaying(false);
    setTimeout(() => { a === "like" ? onLike(p) : onPass(p); setDir(null); setIdx((i: number) => (i + 1) % profiles.length); }, 300);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      style={{ padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingBottom: 100 }}>
      <motion.div animate={{ x: dir === "right" ? 300 : dir === "left" ? -300 : 0, opacity: dir ? 0 : 1, rotate: dir === "right" ? 15 : dir === "left" ? -15 : 0 }} transition={{ duration: 0.3 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
        <div style={{ position: "relative" }}>
          <motion.div animate={playing ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 160, height: 160, borderRadius: "50%", background: `linear-gradient(135deg,${p.grad[0]},${p.grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: playing ? `0 0 60px ${p.grad[0]}40` : `0 8px 32px rgba(0,0,0,0.3)` }}>
            <Volume2 size={56} color="rgba(255,255,255,0.5)" />
          </motion.div>
          {playing && <>
            <motion.div animate={{ scale: [1, 1.6], opacity: [0.3, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "absolute", inset: -16, borderRadius: "50%", border: `2px solid ${p.grad[0]}` }} />
            <motion.div animate={{ scale: [1, 1.8], opacity: [0.2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} style={{ position: "absolute", inset: -16, borderRadius: "50%", border: `2px solid ${p.grad[1]}` }} />
          </>}
        </div>
        <div style={{ background: T.bgCard, padding: "10px 20px", borderRadius: 50, border: `1px solid ${T.bd}`, textAlign: "center" }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: T.tx }}>{p.firstName}, {p.age} ans</span>
          <span style={{ display: "block", fontSize: 11, color: T.txD, marginTop: 2 }}>{p.occupation} · {p.city}</span>
        </div>
      </motion.div>

      <Glass style={{ padding: 24, width: "100%" }}>
        {p.intention && (
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{ padding: "5px 14px", borderRadius: 50, fontSize: 12, fontWeight: 600, background: "rgba(244,63,94,0.1)", color: T.rose, border: "1px solid rgba(244,63,94,0.15)" }}>
              {p.intention === "serious" ? "💘 Relation sérieuse" : p.intention === "casual" ? "🔥 Casual" : p.intention === "friendship" ? "😊 Amitié" : "🤷 Ouvert"}
            </span>
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, justifyContent: "center" }}>
          {p.passions.map((x: string) => <span key={x} style={{ padding: "6px 14px", borderRadius: 50, background: "rgba(139,92,246,0.1)", color: T.acL, fontSize: 12, fontWeight: 600, border: "1px solid rgba(139,92,246,0.15)" }}>{x}</span>)}
        </div>
        <VoiceWave playing={playing} />
        <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPlaying(!playing)}
            style={{ width: 64, height: 64, borderRadius: "50%", border: "none", background: `linear-gradient(135deg,${T.ac},${T.acD})`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 24px ${T.acGlow}` }}>
            {playing ? <Pause size={28} color="#fff" /> : <Play size={28} color="#fff" style={{ marginLeft: 3 }} />}
          </motion.button>
        </div>
        <p style={{ textAlign: "center", color: T.txM, fontSize: 14, fontStyle: "italic", lineHeight: 1.6 }}>"{p.bio}"</p>
      </Glass>

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => act("pass")} style={{ width: 64, height: 64, borderRadius: "50%", border: `2px solid ${T.bdL}`, background: T.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={28} color={T.txM} /></motion.button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => act("like")} style={{ width: 72, height: 72, borderRadius: "50%", border: "none", background: `linear-gradient(135deg,${T.rose},#DC2626)`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 24px rgba(244,63,94,0.3)" }}><Heart size={32} color="#fff" fill="#fff" /></motion.button>
      </div>
    </motion.div>
  );
}